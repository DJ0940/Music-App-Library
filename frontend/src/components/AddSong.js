import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        // Fetch genres when component mounts
        const fetchData = async () => {
            try {
                const genresRes = await axios.get('/api/genres');
                setGenres(genresRes.data);
            } catch (error) {
                setMessage('Error loading data');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form data being sent:', formData);
            
            // First, create or find the artist
            const artistResponse = await axios.post('/api/artists', {
                name: formData.artistName
            });
            console.log('Artist response:', artistResponse.data);

            // Then create the song with the artist ID
            const songData = {
                title: formData.title,
                duration: parseInt(formData.duration),
                releaseYear: parseInt(formData.releaseYear),
                artistId: artistResponse.data._id,
                genreId: formData.genreId
            };
            console.log('Song data being sent:', songData);

            const songResponse = await axios.post('/api/songs', songData);
            console.log('Song response:', songResponse.data);

            setMessage('Song added successfully!');
            setFormData({
                title: '',
                duration: '',
                releaseYear: '',
                artistName: '',
                genreId: ''
            });
            navigate('/songs');
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error adding song');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-4">
            <h2>Add New Song</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Duration (seconds)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Release Year</label>
                    <input
                        type="number"
                        className="form-control"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Artist Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="artistName"
                        value={formData.artistName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <select
                        className="form-control"
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
                <button type="submit" className="btn btn-primary">Add Song</button>
            </form>
        </div>
    );
};

export default AddSong; 