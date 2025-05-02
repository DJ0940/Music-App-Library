import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSong = () => {
    const { id } = useParams();
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
        const fetchData = async () => {
            try {
                const [songRes, genresRes] = await Promise.all([
                    axios.get(`/api/songs/${id}`),
                    axios.get('/api/genres')
                ]);

                const song = songRes.data;
                setFormData({
                    title: song.title,
                    duration: song.duration,
                    releaseYear: song.releaseYear,
                    artistName: song.artist.name,
                    genreId: song.genre._id
                });
                setGenres(genresRes.data);
            } catch (error) {
                setMessage('Error loading data');
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First, create or find the artist
            const artistResponse = await axios.post('/api/artists', {
                name: formData.artistName
            });

            // Then update the song with the artist ID
            await axios.put(`/api/songs/${id}`, {
                title: formData.title,
                duration: formData.duration,
                releaseYear: formData.releaseYear,
                artistId: artistResponse.data._id,
                genreId: formData.genreId
            });

            setMessage('Song updated successfully!');
            navigate('/songs');
        } catch (error) {
            setMessage('Error updating song');
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
            <h2>Edit Song</h2>
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
                <button type="submit" className="btn btn-primary">Update Song</button>
            </form>
        </div>
    );
};

export default EditSong; 