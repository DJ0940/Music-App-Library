import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PlaylistList = () => {
    const [playlists, setPlaylists] = useState([]);
    const [message, setMessage] = useState('');
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/playlists');
            setPlaylists(response.data);
        } catch (error) {
            setMessage('Error loading playlists');
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/playlists', newPlaylist);
            setMessage('Playlist created successfully');
            setNewPlaylist({ name: '', description: '' });
            fetchPlaylists();
        } catch (error) {
            setMessage('Error creating playlist');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                await axios.delete(`http://localhost:5000/api/playlists/${id}`);
                setMessage('Playlist deleted successfully');
                fetchPlaylists();
            } catch (error) {
                setMessage('Error deleting playlist');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Playlists</h2>
            {message && <div className="alert alert-info">{message}</div>}

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Create New Playlist</h5>
                            <form onSubmit={handleCreatePlaylist}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPlaylist.name}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        value={newPlaylist.description}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Create Playlist</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {playlists.map(playlist => (
                    <div key={playlist._id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{playlist.name}</h5>
                                <p className="card-text">{playlist.description}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        {playlist.songs.length} songs
                                    </small>
                                </p>
                                <Link 
                                    to={`/playlists/${playlist._id}`} 
                                    className="btn btn-info me-2"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => handleDelete(playlist._id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistList; 