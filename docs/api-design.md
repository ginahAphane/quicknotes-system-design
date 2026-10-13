# QuickNotes API Specification - 6 Domain-Specific Endpoints

Base URL: https://api.quicknotes.com/v1

Auth: Bearer JWT token in Authorization header.

## Endpoints

### 1. Create Note
POST /notes
Body: { title, content, tagIds[] }
Success: 201 Created { id: 101, title, content, createdAt }
Error: 401 Unauthorized { error: "Missing token" }, 403 Forbidden { error: "User quota exceeded" }, 400 Bad Request

### 2. Get All Notes for User
GET /notes?limit=20&offset=0
Success: 200 OK [ {id, title, content, tags[]} ]
Error: 401 Unauthorized { error: "Invalid token" }

### 3. Get Single Note
GET /notes/:id
Success: 200 OK { id, title, content, tags[] }
Error: 404 Not Found { error: "Note not found" }, 401, 403

### 4. Update Note
PUT /notes/:id
Body: { title, content, tagIds[] }
Success: 200 OK { id, title, content, updatedAt }
Error: 401, 403 { error: "Not owner of note" }, 404

### 5. Delete Note
DELETE /notes/:id
Success: 204 No Content
Error: 401, 403, 404 { error: "Note not found or not authorized" }

### 6. Search Notes by Tag / Query
GET /notes/search?q=work&tag=important
Success: 200 OK [ {id, title, tags[]} ]
Error: 401, 400

## Standard Error Response Payloads
All errors return JSON:
{
  "code": 401,
  "message": "Authentication required",
  "details": "JWT token is missing or expired"
}
401 = Unauthorized (not logged in)
403 = Forbidden (logged in but not allowed)
404 = Not Found
400 = Bad Request
500 = Internal Server Error

Authentication: All endpoints require Authorization: Bearer <jwt>
Authorization: User can only access own notes (checked via user_id from JWT vs note.user_id)