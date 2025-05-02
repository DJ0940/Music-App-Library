import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SongList from './components/SongList';
import AddSong from './components/AddSong';
import EditSong from './components/EditSong';
import SongReport from './components/SongReport';
import PlaylistList from './components/PlaylistList';
import PlaylistDetail from './components/PlaylistDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Music Collection Manager</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/songs">Songs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/songs/add">Add Song</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/playlists">Playlists</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/report">Report</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<SongList />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/songs/add" element={<AddSong />} />
          <Route path="/songs/edit/:id" element={<EditSong />} />
          <Route path="/playlists" element={<PlaylistList />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/report" element={<SongReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
