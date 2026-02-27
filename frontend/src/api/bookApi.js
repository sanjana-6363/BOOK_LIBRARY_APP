const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/books";

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
};

// GET ALL
export const getBooks = async () => {
    const response = await fetch(BASE_URL);
    return handleResponse(response);
};

// CREATE
export const createBook = async (book) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
    });
    return handleResponse(response);
};

// UPDATE
export const updateBook = async (id, updates) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    return handleResponse(response);
};

// DELETE
export const deleteBookApi = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });
    return handleResponse(response);
};