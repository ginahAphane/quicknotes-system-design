# QuickNotes System Design

A simple, scalable notes app capstone for PLP. Client uses JSONPlaceholder API for GET/POST/DELETE with full loading/success/error/empty states.

## Description
QuickNotes lets users load 10 notes, create notes (title required, max 100 chars), and delete notes. Demonstrates API client best practices + system design docs.

## How to Run the API Client
1. Clone repo: `git clone https://github.com/your-username/quicknotes-system-design.git`
2. Open `index.html` in browser (or use Live Server).
3. Click Load Notes, create note, delete note. No build needed.
4. API URL: https://jsonplaceholder.typicode.com/posts

## Documents
- [API Design](docs/api-design.md) - 7 REST endpoints, examples, error codes
- [Data Model](docs/data-model.md) - tables, relationships, SQL, indexes
- [Architecture](docs/architecture.md) - requirements, load estimate, diagram, flows, trade-offs

## What I Learned
1. How to build a reusable request() wrapper with fetch, response.ok check, and try/catch/finally for robust error handling.
2. Why separation of metadata (Postgres) and cache (Redis) and CDN is key for read-heavy systems, and how read replicas scale reads.
3. How to model many-to-many relationships with a join table and why SQL is better than NoSQL for relational notes + tags with JOIN queries.

## Git History
At least 5 meaningful commits as required.