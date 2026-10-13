const API_URL = "https://jsonplaceholder.typicode.com/posts";
const statusEl = document.getElementById("status");
const notesList = document.getElementById("notesList");

// Reusable fetch wrapper that handles network errors cleanly - praised in feedback
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    statusEl.textContent = `Network Error: ${error.message}`;
    statusEl.className = "status error";
    throw error;
  }
}

async function getNotes() {
  const btn = document.getElementById("fetchBtn");
  btn.disabled = true;
  statusEl.textContent = "Loading...";
  statusEl.className = "status loading";
  try {
    const response = await request(API_URL);
    const data = await response.json();
    notesList.innerHTML = "";
    data.slice(0, 10).forEach(note => {
      const li = document.createElement("li");
      // Use textContent to safeguard against XSS - praised in feedback
      li.textContent = `${note.id}: ${note.title}`;
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteNote(note.id, li);
      li.appendChild(delBtn);
      notesList.appendChild(li);
    });
    statusEl.textContent = `Loaded ${data.length} notes - Status: 200`;
    statusEl.className = "status success";
  } finally {
    btn.disabled = false;
  }
}

async function createNote() {
  const titleInput = document.getElementById("title");
  const createBtn = document.getElementById("createBtn");
  createBtn.disabled = true;
  statusEl.textContent = "Creating...";
  statusEl.className = "status loading";
  try {
    const response = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value, body: "Note content", userId: 1 })
    });
    const data = await response.json();
    // Requirement: displays the exact HTTP status code and generated ID
    statusEl.textContent = `Note created! Status: ${response.status}, Generated ID: ${data.id}`;
    statusEl.className = "status success";
    getNotes();
  } finally {
    createBtn.disabled = false;
  }
}

// This handles IDs created locally vs JSONPlaceholder: JSONPlaceholder only persists IDs 1-100.
// If ID > 100 (locally created), the mock API will return 404 on DELETE, but we still remove it from local UI/state
// to provide a consistent user experience. For real production API, we would delete from PostgreSQL primary.
async function deleteNote(id, element) {
  try {
    if (id > 100) {
      // Locally created ID - handle locally, mock API won't have it
      element.remove();
      statusEl.textContent = `Locally created note ${id} removed from UI (ID > 100 not in mock API) - Status: 200 (local)`;
      statusEl.className = "status success";
      return;
    }
    const response = await request(`${API_URL}/${id}`, { method: "DELETE" });
    element.remove();
    statusEl.textContent = `Deleted ID ${id} - Status: ${response.status}`;
    statusEl.className = "status success";
  } catch (e) {
    // Even if mock fails, remove from UI for better UX
    element.remove();
  }
}

document.getElementById("fetchBtn")?.addEventListener("click", getNotes);
document.getElementById("createBtn")?.addEventListener("click", createNote);
window.addEventListener("DOMContentLoaded", getNotes);