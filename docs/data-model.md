# Data Model

## Entity: Note
- id: INT PK AUTO_INCREMENT
- title: VARCHAR(100) NOT NULL
- body: TEXT
- userId: INT FK
- created_at: TIMESTAMP DEFAULT NOW()

## SQL
CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(255) UNIQUE);
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  body TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_notes_user_created ON notes(user_id, created_at DESC);
CREATE INDEX idx_notes_title ON notes(title);

## Relationships
User 1-N Notes. One user can have many notes.

## Justification
VARCHAR(100) enforces max 100 validation. Index on created_at for fast loading of recent 10 notes. Index on title for search.