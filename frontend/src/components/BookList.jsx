import React, { useEffect, useState } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);
        loadBooks();
    }, []);

    const loadBooks = (search = '') => {
        BookService.getAllBooks(search)
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('Error fetching books', error);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadBooks(searchTerm);
        if (searchTerm.trim()) {
            const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 5);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const handleHistoryClick = (term) => {
        setSearchTerm(term);
        loadBooks(term);
    };

    const deleteBook = (id) => {
        BookService.deleteBook(id)
            .then(() => {
                loadBooks(searchTerm);
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

            <div style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search books by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1, marginBottom: 0 }}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    {searchTerm && <button type="button" onClick={() => { setSearchTerm(''); loadBooks(''); }} className="btn btn-secondary">Clear</button>}
                </form>

                {searchHistory.length > 0 && (
                    <div style={{ padding: '1rem', background: 'var(--glass)', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--subtext-color)', fontSize: '0.875rem' }}>Recent Searches:</span>
                            <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>Clear History</button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {searchHistory.map((term, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleHistoryClick(term)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        color: 'var(--primary-color)',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {term}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
                    {searchTerm ? (
                        <>
                            <h2>No results found</h2>
                            <p>Try a different keyword or clear your search.</p>
                        </>
                    ) : (
                        <>
                            <h2>No books found</h2>
                            <p>Get started by adding a new book to the collection.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookList;
