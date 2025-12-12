import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axios';

const PlaylistList = () => {
    const [playlists, setPlaylists] = useState([]);
    const [message, setMessage] = useState('');
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/playlists');
            setPlaylists(response.data);
        } catch (error) {
            setMessage('Error loading playlists');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/playlists', newPlaylist);
            setMessage('Playlist created successfully!');
            setNewPlaylist({ name: '', description: '' });
            setShowCreateForm(false);
            fetchPlaylists();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error creating playlist');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                await axiosInstance.delete(`/api/playlists/${id}`);
                setMessage('Playlist deleted successfully');
                fetchPlaylists();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting playlist');
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="container mt-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📝 Playlists</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? '✕ Cancel' : '➕ New Playlist'}
                </button>
            </div>

            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} slide-in`}>
                    {message}
                </div>
            )}

            {showCreateForm && (
                <div className="card glass mb-4 slide-in">
                    <div className="card-body">
                        <h5 className="card-title mb-4">✨ Create New Playlist</h5>
                        <form onSubmit={handleCreatePlaylist}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">📝 Playlist Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPlaylist.name}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                                        placeholder="e.g., My Favorite Songs"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">💭 Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPlaylist.description}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                                        placeholder="Describe your playlist..."
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">
                                ✨ Create Playlist
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading playlists...</p>
                </div>
            ) : playlists.length === 0 ? (
                <div className="card glass text-center py-5">
                    <div className="card-body">
                        <h3>📝 No Playlists Yet</h3>
                        <p className="text-secondary mb-4">Create your first playlist to organize your music!</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(true)}
                        >
                            ➕ Create Your First Playlist
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {playlists.map((playlist, index) => (
                        <div 
                            key={playlist._id} 
                            className="col-lg-4 col-md-6 mb-4 fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="card glass h-100 hover-lift">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-2" style={{ color: 'var(--primary-light)' }}>
                                                <strong>{playlist.name}</strong>
                                            </h5>
                                            <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                                                {playlist.description || 'No description'}
                                            </p>
                                        </div>
                                        <div 
                                            className="badge bg-primary ms-2" 
                                            style={{ 
                                                minWidth: '45px', 
                                                height: '45px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                borderRadius: '12px',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            {playlist.songs.length}
                                        </div>
                                    </div>
                                    
                                    <div className="text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                                        🎵 {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                                    </div>

                                    <div className="mt-auto d-flex gap-2">
                                        <Link 
                                            to={`/playlists/${playlist._id}`} 
                                            className="btn btn-info flex-grow-1"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(playlist._id)}
                                            className="btn btn-danger"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistList; 