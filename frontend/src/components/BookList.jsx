import React, { useEffect, useState } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = () => {
        BookService.getAllBooks()
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('Error fetching books', error);
            });
    };

    const deleteBook = (id) => {
        BookService.deleteBook(id)
            .then(() => {
                loadBooks();
            })
            .catch(error => {
                console.error('Error deleting book', error);
            });
    };

    return (
        <div className="container">
            <nav className="navbar">
                <Link to="/" className="brand">BookStore</Link>
                <Link to="/add" className="btn btn-primary">Add New Book</Link>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {books.map(book => (
                    <div key={book.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        {book.coverImage && (
                            <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                        )}
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
                        <p style={{ color: 'var(--subtext-color)', margin: '0 0 1rem 0' }}>{book.author}</p>
                        <p style={{ flexGrow: 1 }}>{book.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${book.price}</span>
                            <div>
                                <Link to={`/edit/${book.id}`} className="btn btn-secondary" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}>Edit</Link>
                                <button onClick={() => deleteBook(book.id)} className="btn btn-danger" style={{ fontSize: '0.875rem' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--subtext-color)' }}>
                    <h2>No books found</h2>
                    <p>Get started by adding a new book to the collection.</p>
                </div>
            )}
        </div>
    );
};

export default BookList;
