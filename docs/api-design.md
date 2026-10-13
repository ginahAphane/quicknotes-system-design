# API Design

Base URL: https://jsonplaceholder.typicode.com

## Endpoints
1. GET /posts?_limit=10 - Get notes
   - 200 OK -> [{id, title, body}]
   - 500 Error

2. POST /posts - Create note
   - Body: {title: string required max 100, body: string, userId: 1}
   - 201 Created -> {id, title, body}
   - 400 Bad Request if validation fails

3. DELETE /posts/{id} - Delete note
   - 200 OK -> {}
   - 404 Not Found
   - 500 Server Error

## RESTful Principles
- Uses HTTP methods, JSON, proper status codes, resource-based URLs.

## Example
POST /posts
{ "title": "My note", "body": "content" }
=> 201 { "id": 101, "title": "My note", "body": "content" }