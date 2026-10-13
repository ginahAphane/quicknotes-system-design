# QuickNotes Data Model

We use PostgreSQL (Relational) because notes require ACID transactions, strong consistency for user data, and many-to-many joins for tagging which are inefficient in NoSQL. NoSQL would require denormalization and duplicate data.

## Tables

### users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

### notes
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);

### tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tags_name ON tags(name);

### note_tags (Join Table for Many-to-Many)
CREATE TABLE note_tags (
  note_id INT REFERENCES notes(id) ON DELETE CASCADE,
  tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

## Sample SQL Queries

1. Get all notes for a user with their tags:
SELECT n.id, n.title, t.name as tag_name
FROM notes n
LEFT JOIN note_tags nt ON n.id = nt.note_id
LEFT JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = 1;

2. Get all notes that have tag 'work':
SELECT n.*
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id
WHERE t.name = 'work' AND n.user_id = 1;

3. Count notes per tag:
SELECT t.name, COUNT(nt.note_id) as note_count
FROM tags t
JOIN note_tags nt ON t.id = nt.tag_id
GROUP BY t.name;

## Trade-off Analysis: Relational vs NoSQL
Relational (PostgreSQL) is better because: 1) Strong relationships between users, notes, tags. 2) Need for JOINs. 3) ACID for data integrity. 4) Easy indexing. NoSQL (like MongoDB) would need to embed tags array in note document causing duplication and harder tag renaming. Relational avoids duplication via normalized join table.