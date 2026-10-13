# Architecture

## Diagram
[Client] Browser (HTML/CSS/JS api.js)
   -> fetch/request()
   -> JSONPlaceholder API (REST)
   -> Response -> UI States

## Components
- index.html: UI with required IDs
- api.js: request() wrapper, CRUD logic
- style.css: styling
- JSONPlaceholder: mock backend

## Estimates
- Users: 1k MVP, 100k scaled
- Notes: 10 per user MVP, 10k per user scaled
- Storage: 1KB per note

## Request Flows
1. Load: Click load-btn -> status loading -> GET /posts?_limit=10 -> render notes-list -> status success/empty/error
2. Create: Fill title-input/body-input -> validate -> POST -> status -> reload
3. Delete: Click Delete -> DELETE /posts/id -> reload

## Trade-offs
- Chose JSONPlaceholder: no auth needed, good for MVP, but no real persistence
- Client-side validation: fast feedback but need server validation later
- No backend: simple but not scalable
- Future: Add real DB (PostgreSQL), Auth (JWT), Caching (Redis), Pagination
