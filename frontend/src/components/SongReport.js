import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                    axios.get('/api/artists'),
                    axios.get('/api/genres')
                ]);
                setArtists(artistsRes.data);
                setGenres(genresRes.data);
            } catch (error) {
                setMessage('Error loading data: ' + (error.response?.data?.message || error.message));
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
            // Validate year inputs
            if (filters.startYear && filters.endYear && 
                parseInt(filters.startYear) > parseInt(filters.endYear)) {
                throw new Error('Start year cannot be greater than end year');
            }

            const response = await axios.get('/api/songs/report', {
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

    return (
        <div className="container mt-4">
            <h2>Song Report</h2>
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
            
            <form onSubmit={generateReport} className="mb-4">
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label">Genre</label>
                            <select
                                className="form-control"
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
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label">Artist</label>
                            <select
                                className="form-control"
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
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label">Start Year</label>
                            <input
                                type="number"
                                className="form-control"
                                name="startYear"
                                value={filters.startYear}
                                onChange={handleChange}
                                placeholder="From Year"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label">End Year</label>
                            <input
                                type="number"
                                className="form-control"
                                name="endYear"
                                value={filters.endYear}
                                onChange={handleChange}
                                placeholder="To Year"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </form>

            {report && (
                <div>
                    <h3>Statistics</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">General Statistics</h5>
                                    <p>Total Songs: {report.stats.totalSongs}</p>
                                    <p>Average Duration: {Math.round(report.stats.averageDuration)} seconds</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Songs per Genre</h5>
                                    {report.stats.songsPerGenre && Object.entries(report.stats.songsPerGenre).map(([genre, count]) => (
                                        <p key={genre}>{genre}: {count}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3>Filtered Songs</h3>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Genre</th>
                                    <th>Duration</th>
                                    <th>Release Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.songs.map(song => (
                                    <tr key={song._id}>
                                        <td>{song.title}</td>
                                        <td>{song.artist.name}</td>
                                        <td>{song.genre.name}</td>
                                        <td>{song.duration} seconds</td>
                                        <td>{song.releaseYear}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongReport; 