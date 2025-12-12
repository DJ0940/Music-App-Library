import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axios';

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/songs');
            // Shuffle the songs array randomly
            const shuffled = [...response.data].sort(() => Math.random() - 0.5);
            setSongs(shuffled);
            setMessage('');
        } catch (error) {
            setMessage('Error loading songs');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this song?')) {
            try {
                await axiosInstance.delete(`/api/songs/${id}`);
                setMessage('Song deleted successfully');
                fetchSongs();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting song');
                console.error('Error:', error);
            }
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mt-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🎵 Music Library</h2>
                <Link to="/songs/add" className="btn btn-primary">
                    ➕ Add New Song
                </Link>
            </div>
            
            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} slide-in`}>
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading your music collection...</p>
                </div>
            ) : songs.length === 0 ? (
                <div className="card glass text-center py-5">
                    <div className="card-body">
                        <h3>🎼 No Songs Yet</h3>
                        <p className="text-secondary mb-4">Start building your music collection!</p>
                        <Link to="/songs/add" className="btn btn-primary">
                            Add Your First Song
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card glass">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>🎵 Title</th>
                                        <th>🎤 Artist</th>
                                        <th>🎸 Genre</th>
                                        <th>⏱️ Duration</th>
                                        <th>📅 Year</th>
                                        <th>⚙️ Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {songs.map((song, index) => (
                                        <tr key={song._id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
                                            <td>
                                                <strong style={{ fontSize: '1.05rem' }}>{song.title}</strong>
                                            </td>
                                            <td>
                                                <span className="artist-name">{song.artist.name}</span>
                                            </td>
                                            <td>
                                                <span className="genre-badge">{song.genre.name}</span>
                                            </td>
                                            <td>
                                                <span className="song-duration">{formatDuration(song.duration)}</span>
                                            </td>
                                            <td>
                                                <span className="release-year">{song.releaseYear}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link 
                                                        to={`/songs/edit/${song._id}`} 
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(song._id)}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer glass text-center py-3">
                        <small className="text-secondary">
                            📊 Total Songs: <strong className="text-primary">{songs.length}</strong>
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongList; 