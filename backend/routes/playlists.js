const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// Get all playlists with populated song details
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find()
            .populate({
                path: 'songs.song',
                populate: [
                    { path: 'artist' },
                    { path: 'genre' }
                ]
            });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single playlist by ID
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate({
                path: 'songs.song',
                populate: [
                    { path: 'artist' },
                    { path: 'genre' }
                ]
            });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new playlist
router.post('/', async (req, res) => {
    const playlist = new Playlist({
        name: req.body.name,
        description: req.body.description,
        songs: []
    });

    try {
        const newPlaylist = await playlist.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a song to a playlist
router.post('/:id/songs', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if song already exists in playlist
        const songExists = playlist.songs.some(song => song.song.toString() === req.body.songId);
        if (songExists) {
            return res.status(400).json({ message: 'Song already exists in playlist' });
        }

        playlist.songs.push({
            song: req.body.songId,
            addedAt: new Date()
        });

        const updatedPlaylist = await playlist.save();
        const populatedPlaylist = await Playlist.findById(updatedPlaylist._id)
            .populate({
                path: 'songs.song',
                populate: [
                    { path: 'artist' },
                    { path: 'genre' }
                ]
            });

        res.json(populatedPlaylist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove a song from a playlist
router.delete('/:id/songs/:songId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.songs = playlist.songs.filter(
            song => song.song.toString() !== req.params.songId
        );

        await playlist.save();
        res.json({ message: 'Song removed from playlist' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a playlist
router.delete('/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update playlist details (name and description)
router.put('/:id', async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description
            },
            { new: true }
        ).populate({
            path: 'songs.song',
            populate: [
                { path: 'artist' },
                { path: 'genre' }
            ]
        });

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json(updatedPlaylist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 