import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axios';

const AddSong = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        releaseYear: '',
        artistName: '',
        genreId: ''
    });
    const [genres, setGenres] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const genresRes = await axiosInstance.get('/api/genres');
                setGenres(genresRes.data);
            } catch (error) {
                setMessage('Error loading data');
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const artistResponse = await axiosInstance.post('/api/artists', {
                name: formData.artistName
            });

            const songData = {
                title: formData.title,
                duration: parseInt(formData.duration),
                releaseYear: parseInt(formData.releaseYear),
                artistId: artistResponse.data._id,
                genreId: formData.genreId
            };

            await axiosInstance.post('/api/songs', songData);

            setMessage('Song added successfully!');
            setTimeout(() => navigate('/songs'), 1500);
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error adding song');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-5 fade-in">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center mb-4">
                        <Link to="/songs" className="btn btn-outline-primary me-3">
                            ← Back
                        </Link>
                        <h2 className="mb-0">🎵 Add New Song</h2>
                    </div>

                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} slide-in`}>
                            {message}
                        </div>
                    )}

                    <div className="card glass">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 mb-4">
                                        <label className="form-label">🎵 Song Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter song title..."
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">🎤 Artist Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="artistName"
                                            value={formData.artistName}
                                            onChange={handleChange}
                                            placeholder="Enter artist name..."
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">🎸 Genre</label>
                                        <select
                                            className="form-select"
                                            name="genreId"
                                            value={formData.genreId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Genre</option>
                                            {genres.map(genre => (
                                                <option key={genre._id} value={genre._id}>
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">⏱️ Duration (seconds)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="e.g., 180"
                                            required
                                        />
                                        <small className="text-secondary">
                                            {formData.duration && `≈ ${Math.floor(formData.duration / 60)}:${(formData.duration % 60).toString().padStart(2, '0')}`}
                                        </small>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label">📅 Release Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="releaseYear"
                                            value={formData.releaseYear}
                                            onChange={handleChange}
                                            placeholder="e.g., 2024"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-3">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-grow-1"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            <>✨ Add Song</>
                                        )}
                                    </button>
                                    <Link to="/songs" className="btn btn-outline-secondary">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSong; 