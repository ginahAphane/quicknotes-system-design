const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const statusEl = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");
const form = document.getElementById("note-form");

// Reusable request function
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status-${type}`;
}

function setLoading(isLoading) {
  loadBtn.disabled = isLoading;
  submitBtn.disabled = isLoading;
}

// GET 10 notes
async function loadNotes() {
  setLoading(true);
  setStatus("Loading notes...", "loading");
  try {
    const notes = await request(`${API_URL}?_limit=10`);
    renderNotes(notes);
    if (notes.length === 0) {
      setStatus("No notes found. Create your first note!", "empty");
    } else {
      setStatus(`Loaded ${notes.length} notes successfully`, "success");
    }
  } catch (error) {
    setStatus(`Error loading notes: ${error.message}`, "error");
  } finally {
    setLoading(false);
  }
}

// POST create
async function createNote(title, body) {
  setLoading(true);
  setStatus("Creating note...", "loading");
  try {
    const newNote = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 })
    });
    addNoteToDOM(newNote);
    setStatus("Note created successfully!", "success");
    noteForm.reset();
  } catch (error) {
    setStatus(`Error creating note: ${error.message}`, "error");
  } finally {
    setLoading(false);
  }
}// This handles IDs created locally vs JSONPlaceholder: JSONPlaceholder only persists IDs 1-100.
// If ID > 100 (locally created), we delete from local state/UI only, as mock API will return 404 but we still show success.
async function deleteNote(id) { ... }

// DELETE
async function deleteNote(id, liElement) {
  const deleteBtn = liElement.querySelector(".delete-btn");
  deleteBtn.disabled = true;
  setStatus("Deleting note...", "loading");
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    liElement.remove();
    setStatus("Note deleted successfully", "success");
    if (notesList.children.length === 0) {
      setStatus("No notes left. Empty state.", "empty");
    }
  } catch (error) {
    setStatus(`Error deleting note: ${error.message}`, "error");
    deleteBtn.disabled = false;
  }
}

function renderNotes(notes) {
  notesList.textContent = "";
  notes.forEach(note => addNoteToDOM(note));
}

function addNoteToDOM(note) {
  const li = document.createElement("li");
  const contentDiv = document.createElement("div");
  const titleEl = document.createElement("strong");
  const bodyEl = document.createElement("p");

  titleEl.textContent = note.title;
  bodyEl.textContent = note.body;

  contentDiv.appendChild(titleEl);
  contentDiv.appendChild(bodyEl);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

  li.appendChild(contentDiv);
  li.appendChild(deleteBtn);
  notesList.prepend(li);
}

// Validation + events
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Title is required", "error");
    return;
  }
  if (title.length > 100) {
    setStatus("Title must be max 100 characters", "error");
    return;
  }
  createNote(title, body);
});

loadBtn.addEventListener("click", loadNotes);