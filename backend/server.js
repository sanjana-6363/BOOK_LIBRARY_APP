import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

// ------------------
// MongoDB Connection
// ------------------
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// ------------------
// Schema & Model
// ------------------
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

// ------------------
// ROUTES
// ------------------

// READ ALL
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE
app.post("/api/books", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title?.trim() || !author?.trim() || !category?.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBook = await Book.create({ title: title.trim(), author: author.trim(), category: category.trim() });
        res.status(201).json(newBook);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE
app.put("/api/books/:id", async (req, res) => {
    try {
        const { title, author, category } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (title !== undefined) book.title = title.trim();
        if (author !== undefined) book.author = author.trim();
        if (category !== undefined) book.category = category.trim();

        await book.save();
        res.json(book);

    } catch (error) {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// DELETE
app.delete("/api/books/:id", async (req, res) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// ------------------
// SERVER START
// ------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});