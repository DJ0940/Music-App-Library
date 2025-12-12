import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';

const SongReport = () => {
    const [filters, setFilters] = useState({
        genreId: '',
        artistId: '',
        startYear: '',
        endYear: ''
    });
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [report, setReport] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artistsRes, genresRes] = await Promise.all([
                    axiosInstance.get('/api/artists'),
                    axiosInstance.get('/api/genres')
                ]);
                setArtists(artistsRes.data);
                setGenres(genresRes.data);
            } catch (error) {
                setMessage('Error loading data: ' + (error.response?.data?.message || error.message));
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const generateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            if (filters.startYear && filters.endYear && 
                parseInt(filters.startYear) > parseInt(filters.endYear)) {
                throw new Error('Start year cannot be greater than end year');
            }

            const response = await axiosInstance.get('/api/songs/report', {
                params: filters
            });
            setReport(response.data);
            if (response.data.songs.length === 0) {
                setMessage('No songs found matching the filters');
            }
        } catch (error) {
            console.error('Report error:', error);
            setMessage('Error generating report: ' + (error.response?.data?.message || error.message));
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mt-5 fade-in">
            <h2>📊 Music Analytics</h2>
            
            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'} slide-in`}>
                    {message}
                </div>
            )}
            
            <div className="card glass mb-4">
                <div className="card-body">
                    <h5 className="mb-4">🔍 Filter Your Music</h5>
                    <form onSubmit={generateReport}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">🎸 Genre</label>
                                <select
                                    className="form-select"
                                    name="genreId"
                                    value={filters.genreId}
                                    onChange={handleChange}
                                >
                                    <option value="">All Genres</option>
                                    {genres.map(genre => (
                                        <option key={genre._id} value={genre._id}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">🎤 Artist</label>
                                <select
                                    className="form-select"
                                    name="artistId"
                                    value={filters.artistId}
                                    onChange={handleChange}
                                >
                                    <option value="">All Artists</option>
                                    {artists.map(artist => (
                                        <option key={artist._id} value={artist._id}>
                                            {artist.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">📅 From Year</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="startYear"
                                    value={filters.startYear}
                                    onChange={handleChange}
                                    placeholder="1900"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">📅 To Year</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="endYear"
                                    value={filters.endYear}
                                    onChange={handleChange}
                                    placeholder={new Date().getFullYear().toString()}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Generating...
                                </>
                            ) : (
                                '📊 Generate Report'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {report && (
                <div className="slide-in">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card glass text-center hover-lift">
                                <div className="card-body">
                                    <div style={{ fontSize: '3rem' }}>🎵</div>
                                    <h3 className="mt-2 mb-1" style={{ fontSize: '2.5rem', color: 'var(--primary-light)' }}>
                                        {report.stats.totalSongs}
                                    </h3>
                                    <p className="text-secondary mb-0">Total Songs</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card glass text-center hover-lift">
                                <div className="card-body">
                                    <div style={{ fontSize: '3rem' }}>⏱️</div>
                                    <h3 className="mt-2 mb-1" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>
                                        {formatDuration(Math.round(report.stats.averageDuration))}
                                    </h3>
                                    <p className="text-secondary mb-0">Avg Duration</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card glass text-center hover-lift">
                                <div className="card-body">
                                    <div style={{ fontSize: '3rem' }}>🎸</div>
                                    <h3 className="mt-2 mb-1" style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>
                                        {Object.keys(report.stats.songsPerGenre || {}).length}
                                    </h3>
                                    <p className="text-secondary mb-0">Genres</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {report.stats.songsPerGenre && Object.keys(report.stats.songsPerGenre).length > 0 && (
                        <div className="card glass mb-4">
                            <div className="card-body">
                                <h5 className="mb-4">🎸 Songs per Genre</h5>
                                <div className="row">
                                    {Object.entries(report.stats.songsPerGenre).map(([genre, count]) => (
                                        <div key={genre} className="col-md-4 mb-3">
                                            <div className="d-flex justify-content-between align-items-center p-3" 
                                                 style={{ 
                                                     background: 'var(--surface-light)', 
                                                     borderRadius: '12px',
                                                     border: '1px solid rgba(99, 102, 241, 0.2)'
                                                 }}>
                                                <span className="genre-badge">{genre}</span>
                                                <span style={{ 
                                                    fontSize: '1.5rem', 
                                                    fontWeight: '700',
                                                    color: 'var(--primary-light)'
                                                }}>
                                                    {count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card glass">
                        <div className="card-body p-0">
                            <div className="p-4 border-bottom" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                                <h5 className="mb-0">🎵 Filtered Songs ({report.songs.length})</h5>
                            </div>
                            {report.songs.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>🎵 Title</th>
                                                <th>🎤 Artist</th>
                                                <th>🎸 Genre</th>
                                                <th>⏱️ Duration</th>
                                                <th>📅 Year</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {report.songs.map((song, index) => (
                                                <tr key={song._id} style={{ animationDelay: `${index * 0.03}s` }} className="fade-in">
                                                    <td><strong>{song.title}</strong></td>
                                                    <td><span className="artist-name">{song.artist.name}</span></td>
                                                    <td><span className="genre-badge">{song.genre.name}</span></td>
                                                    <td><span className="song-duration">{formatDuration(song.duration)}</span></td>
                                                    <td><span className="release-year">{song.releaseYear}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-secondary">No songs match your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongReport; 