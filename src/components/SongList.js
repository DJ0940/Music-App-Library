import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSongs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/songs');
            setSongs(response.data);
        } catch (error) {
            setMessage('Error loading songs');
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this song?')) {
            try {
                await axios.delete(`http://localhost:5000/api/songs/${id}`);
                setMessage('Song deleted successfully');
                fetchSongs();
            } catch (error) {
                setMessage('Error deleting song');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Songs List</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Duration</th>
                            <th>Release Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map(song => (
                            <tr key={song._id}>
                                <td>{song.title}</td>
                                <td>{song.artist.name}</td>
                                <td>{song.genre.name}</td>
                                <td>{song.duration} seconds</td>
                                <td>{song.releaseYear}</td>
                                <td>
                                    <Link to={`/songs/edit/${song._id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                                    <button
                                        onClick={() => handleDelete(song._id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SongList; 