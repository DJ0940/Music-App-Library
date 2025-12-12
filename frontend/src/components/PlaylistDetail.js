import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';

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
            const response = await axiosInstance.get(`/api/playlists/${id}`);
            setPlaylist(response.data);
            setEditData({
                name: response.data.name,
                description: response.data.description
            });
        } catch (error) {
            setMessage('Error loading playlist');
            console.error('Error:', error);
        }
    }, [id]);

    const fetchAvailableSongs = async () => {
        try {
            const response = await axiosInstance.get('/api/songs');
            setAvailableSongs(response.data);
        } catch (error) {
            setMessage('Error loading songs');
            console.error('Error:', error);
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
            await axiosInstance.post(`/api/playlists/${id}/songs`, {
                songId: selectedSong
            });
            setMessage('Song added to playlist!');
            setSelectedSong('');
            fetchPlaylist();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error adding song to playlist');
            console.error('Error:', error);
        }
    };

    const handleRemoveSong = async (songId) => {
        if (window.confirm('Remove this song from the playlist?')) {
            try {
                await axiosInstance.delete(`/api/playlists/${id}/songs/${songId}`);
                setMessage('Song removed from playlist');
                fetchPlaylist();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error removing song from playlist');
                console.error('Error:', error);
            }
        }
    };

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/playlists/${id}`, editData);
            setMessage('Playlist updated successfully!');
            setEditMode(false);
            fetchPlaylist();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating playlist');
            console.error('Error:', error);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!playlist) {
        return (
            <div className="container mt-5 text-center fade-in">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-secondary">Loading playlist...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 fade-in">
            <button 
                className="btn btn-outline-primary mb-4"
                onClick={() => navigate('/playlists')}
            >
                ← Back to Playlists
            </button>

            {editMode ? (
                <div className="card glass mb-4 slide-in">
                    <div className="card-body">
                        <h5 className="mb-4">✏️ Edit Playlist Info</h5>
                        <form onSubmit={handleUpdatePlaylist}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">📝 Playlist Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        placeholder="Playlist name..."
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">💭 Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        placeholder="Description..."
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">
                                    💾 Save
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="card glass mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h2 className="mb-2">{playlist.name}</h2>
                                <p className="text-secondary mb-3">{playlist.description || 'No description'}</p>
                                <div className="d-flex gap-3">
                                    <span className="badge bg-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                        🎵 {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                                    </span>
                                </div>
                            </div>
                            <button 
                                className="btn btn-info"
                                onClick={() => setEditMode(true)}
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} slide-in`}>
                    {message}
                </div>
            )}

            <div className="card glass mb-4">
                <div className="card-body">
                    <h5 className="mb-4">➕ Add Song to Playlist</h5>
                    <form onSubmit={handleAddSong}>
                        <div className="row align-items-end">
                            <div className="col-md-9 mb-3 mb-md-0">
                                <label className="form-label">🎵 Select Song</label>
                                <select
                                    className="form-select"
                                    value={selectedSong}
                                    onChange={(e) => setSelectedSong(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a song...</option>
                                    {availableSongs.map(song => (
                                        <option key={song._id} value={song._id}>
                                            {song.title} - {song.artist.name} ({song.genre.name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary w-100">
                                    ➕ Add Song
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card glass">
                <div className="card-body p-0">
                    <div className="p-4 border-bottom" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                        <h5 className="mb-0">🎵 Songs in Playlist</h5>
                    </div>
                    {playlist.songs.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-secondary mb-0">No songs in this playlist yet</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>🎵 Title</th>
                                        <th>🎤 Artist</th>
                                        <th>🎸 Genre</th>
                                        <th>⏱️ Duration</th>
                                        <th>📅 Added</th>
                                        <th>⚙️ Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playlist.songs.map(({ song, addedAt }, index) => (
                                        <tr key={song._id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
                                            <td><strong>{song.title}</strong></td>
                                            <td><span className="artist-name">{song.artist.name}</span></td>
                                            <td><span className="genre-badge">{song.genre.name}</span></td>
                                            <td><span className="song-duration">{formatDuration(song.duration)}</span></td>
                                            <td><span className="text-secondary">{new Date(addedAt).toLocaleDateString()}</span></td>
                                            <td>
                                                <button
                                                    onClick={() => handleRemoveSong(song._id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    🗑️ Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;
