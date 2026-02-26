import "./App.css";
import { useState, useEffect } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBookApi
} from "./api/bookApi";

function App() {
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState({ title: "", author: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingInput, setEditingInput] = useState({ title: "", author: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (!input.title.trim() || !input.author.trim() || !input.category.trim()) return;
    try {
      const newBook = await createBook(input);
      setBooks([newBook, ...books]);
      setInput({ title: "", author: "", category: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      await deleteBookApi(id);
      setBooks(books.filter(b => b._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (book) => {
    setEditingId(book._id);
    setEditingInput({ title: book.title, author: book.author, category: book.category });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updateBook(id, editingInput);
      setBooks(books.map(b => b._id === id ? updated : b));
      setEditingId(null);
      setEditingInput({ title: "", author: "", category: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="container">
      <h1>Library Book Management</h1>

      {/* Add Book Section */}
      <div className="input-group">
        <input
          placeholder="Title"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
        />
        <input
          placeholder="Author"
          value={input.author}
          onChange={(e) => setInput({ ...input, author: e.target.value })}
        />
        <input
          placeholder="Category"
          value={input.category}
          onChange={(e) => setInput({ ...input, category: e.target.value })}
        />
        <button onClick={addBook}>Add</button>
      </div>

      {/* Book List */}
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            {editingId === book._id ? (
              <div className="edit-row">
                <input
                  value={editingInput.title}
                  onChange={(e) => setEditingInput({ ...editingInput, title: e.target.value })}
                />
                <input
                  value={editingInput.author}
                  onChange={(e) => setEditingInput({ ...editingInput, author: e.target.value })}
                />
                <input
                  value={editingInput.category}
                  onChange={(e) => setEditingInput({ ...editingInput, category: e.target.value })}
                />
                <button className="btn-save" onClick={() => saveEdit(book._id)}>Save</button>
                <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span className="book-text">
                  {book.title} - {book.author} ({book.category})
                </span>
                <div className="actions">
                  <button className="btn-update" onClick={() => startEditing(book)}>✎</button>
                  <button className="btn-delete" onClick={() => deleteBook(book._id)}>✕</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;