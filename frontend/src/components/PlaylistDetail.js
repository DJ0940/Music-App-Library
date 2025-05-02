import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState('');
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', description: '' });

    const fetchPlaylist = useCallback(async () => {
        try {
            const response = await axios.get(`/api/playlists/${id}`);
            setPlaylist(response.data);
            setEditData({
                name: response.data.name,
                description: response.data.description
            });
        } catch (error) {
            setMessage('Error loading playlist');
        }
    }, [id]);

    const fetchAvailableSongs = async () => {
        try {
            const response = await axios.get('/api/songs');
            setAvailableSongs(response.data);
        } catch (error) {
            setMessage('Error loading songs');
        }
    };

    useEffect(() => {
        fetchPlaylist();
        fetchAvailableSongs();
    }, [fetchPlaylist]);

    const handleAddSong = async (e) => {
        e.preventDefault();
        if (!selectedSong) return;

        try {
            await axios.post(`/api/playlists/${id}/songs`, {
                songId: selectedSong
            });
            setMessage('Song added to playlist');
            setSelectedSong('');
            fetchPlaylist();
        } catch (error) {
            setMessage('Error adding song to playlist');
        }
    };

    const handleRemoveSong = async (songId) => {
        try {
            await axios.delete(`/api/playlists/${id}/songs/${songId}`);
            setMessage('Song removed from playlist');
            fetchPlaylist();
        } catch (error) {
            setMessage('Error removing song from playlist');
        }
    };

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/playlists/${id}`, editData);
            setMessage('Playlist updated successfully');
            setEditMode(false);
            fetchPlaylist();
        } catch (error) {
            setMessage('Error updating playlist');
        }
    };

    if (!playlist) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <button 
                className="btn btn-secondary mb-3"
                onClick={() => navigate('/playlists')}
            >
                ← Back to Playlists
            </button>

            {editMode ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>Edit Playlist</h3>
                        <form onSubmit={handleUpdatePlaylist}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{playlist.name}</h2>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setEditMode(true)}
                        >
                            Edit Playlist
                        </button>
                    </div>
                    <p className="text-muted">{playlist.description}</p>
                </div>
            )}

            {message && <div className="alert alert-info">{message}</div>}

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Add Song to Playlist</h5>
                            <form onSubmit={handleAddSong}>
                                <div className="mb-3">
                                    <select
                                        className="form-control"
                                        value={selectedSong}
                                        onChange={(e) => setSelectedSong(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a song</option>
                                        {availableSongs.map(song => (
                                            <option key={song._id} value={song._id}>
                                                {song.title} - {song.artist.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Add Song</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <h4>Songs in Playlist</h4>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Duration</th>
                            <th>Added At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist.songs.map(({ song, addedAt }) => (
                            <tr key={song._id}>
                                <td>{song.title}</td>
                                <td>{song.artist.name}</td>
                                <td>{song.genre.name}</td>
                                <td>{song.duration} seconds</td>
                                <td>{new Date(addedAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleRemoveSong(song._id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Remove
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

export default PlaylistDetail; 