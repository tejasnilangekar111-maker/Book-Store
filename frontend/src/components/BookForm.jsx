import React, { useEffect, useState } from 'react';
import BookService from '../services/BookService';
import { useNavigate, useParams, Link } from 'react-router-dom';

const BookForm = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            BookService.getBookById(id)
                .then(response => {
                    const book = response.data;
                    setTitle(book.title);
                    setAuthor(book.author);
                    setPrice(book.price);
                    setDescription(book.description);
                    setCoverImage(book.coverImage);
                })
                .catch(error => {
                    console.error('Error fetching book', error);
                });
        }
    }, [id]);

    const saveOrUpdateBook = (e) => {
        e.preventDefault();
        const book = { title, author, price, description, coverImage };

        if (id) {
            BookService.updateBook(id, book)
                .then(() => {
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error updating book', error);
                });
        } else {
            BookService.createBook(book)
                .then(() => {
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error creating book', error);
                });
        }
    };

    return (
        <div className="container">
            <nav className="navbar">
                <Link to="/" className="brand">BookStore</Link>
            </nav>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{id ? 'Update Book' : 'Add New Book'}</h2>
                <form onSubmit={saveOrUpdateBook}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Enter book title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <input
                            type="text"
                            placeholder="Enter author name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Cover Image URL</label>
                        <input
                            type="text"
                            placeholder="http://example.com/image.jpg"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" type="submit" style={{ flexGrow: 1 }}>Submit</button>
                        <Link to="/" className="btn btn-danger">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
