import { useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState("login");

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [notes, setNotes] = useState([]);

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      loadNotes();
    }
  }, [token]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotes(token);
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);

      if (
        err.message.includes("expired") ||
        err.message.includes("Invalid")
      ) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNoteChange = (e) => {
    setNoteForm({
      ...noteForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      let data;

      if (authMode === "login") {
        data = await loginUser({
          email: authForm.email,
          password: authForm.password,
        });
      } else {
        data = await registerUser(authForm);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      setAuthForm({
        name: "",
        email: "",
        password: "",
      });

      setMessage(
        authMode === "login"
          ? "Login successful!"
          : "Account created successfully!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();

    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      setError("Please enter both title and content.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingId) {
        const data = await updateNote(
          token,
          editingId,
          noteForm
        );

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note._id === editingId ? data.note : note
          )
        );

        setMessage("Note updated successfully.");
      } else {
        const data = await createNote(token, noteForm);

        setNotes((currentNotes) => [
          data.note,
          ...currentNotes,
        ]);

        setMessage("Note created successfully.");
      }

      setNoteForm({
        title: "",
        content: "",
      });

      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);

    setNoteForm({
      title: note.title,
      content: note.content,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteNote(token, id);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== id)
      );

      if (editingId === id) {
        cancelEdit();
      }

      setMessage("Note deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setNoteForm({
      title: "",
      content: "",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setNotes([]);
    setEditingId(null);

    setNoteForm({
      title: "",
      content: "",
    });
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand">
            <div className="brand-icon">📝</div>

            <h1>NoteFlow</h1>

            <p>
              Your simple and secure note-taking space.
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={
                authMode === "login" ? "active" : ""
              }
              onClick={() => {
                setAuthMode("login");
                setError("");
                setMessage("");
              }}
            >
              Login
            </button>

            <button
              className={
                authMode === "register" ? "active" : ""
              }
              onClick={() => {
                setAuthMode("register");
                setError("");
                setMessage("");
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={handleAuthChange}
                required
              />
            </div>

            {error && (
              <div className="alert error">
                {error}
              </div>
            )}

            {message && (
              <div className="alert success">
                {message}
              </div>
            )}

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <span>📝</span>
            NoteFlow
          </div>

          <div className="user-area">
            <div className="user-info">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <h1>
              Good to see you, {user?.name?.split(" ")[0]} 👋
            </h1>

            <p>
              Capture your ideas, thoughts and important notes.
            </p>
          </div>

          <div className="note-count">
            <strong>{notes.length}</strong>
            <span>
              {notes.length === 1 ? "Note" : "Notes"}
            </span>
          </div>
        </section>

        {error && (
          <div className="alert error">{error}</div>
        )}

        {message && (
          <div className="alert success">{message}</div>
        )}

        <section className="editor-card">
          <div className="editor-header">
            <h2>
              {editingId ? "Edit Note" : "Create a New Note"}
            </h2>

            {editingId && (
              <button
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleNoteSubmit}>
            <input
              className="note-title-input"
              type="text"
              name="title"
              placeholder="Note title..."
              value={noteForm.title}
              onChange={handleNoteChange}
              maxLength="100"
              required
            />

            <textarea
              name="content"
              placeholder="Write your note here..."
              value={noteForm.content}
              onChange={handleNoteChange}
              rows="6"
              required
            />

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Note"
                : "Add Note"}
            </button>
          </form>
        </section>

        <section className="notes-section">
          <div className="section-heading">
            <h2>Your Notes</h2>

            <button
              className="refresh-btn"
              onClick={loadNotes}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading && notes.length === 0 ? (
            <div className="empty-state">
              Loading your notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📔</div>

              <h3>No notes yet</h3>

              <p>
                Create your first note using the editor above.
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article
                  className="note-card"
                  key={note._id}
                >
                  <h3>{note.title}</h3>

                  <p>{note.content}</p>

                  <div className="note-footer">
                    <span>
                      {new Date(
                        note.updatedAt || note.createdAt
                      ).toLocaleString()}
                    </span>

                    <div className="note-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(note._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;