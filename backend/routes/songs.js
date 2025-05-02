const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const mongoose = require('mongoose');
const db = mongoose.connection;
const Artist = require('../models/Artist');

// Get all songs with artist and genre details
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find()
            .populate('artist')
            .populate('genre')
            .sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get song filtered results
router.get('/report', async (req, res) => {
    try {
        const { genreId, artistId, startYear, endYear } = req.query;
        const collection = db.collection('songs'); // using prepared parameters
        const pipeline = [];
        const matchStage = {};
        
        // convert IDs to ObjectId
        try {
            if (genreId && genreId.match(/^[0-9a-fA-F]{24}$/)) {
                matchStage.genre = new mongoose.Types.ObjectId(genreId);
            }
            if (artistId && artistId.match(/^[0-9a-fA-F]{24}$/)) {
                matchStage.artist = new mongoose.Types.ObjectId(artistId);
            }
        } catch (error) {
            console.error('Error converting IDs:', error);
        }

        // Handle year filters
        if (startYear || endYear) {
            matchStage.releaseYear = {};
            if (startYear && !isNaN(startYear)) {
                matchStage.releaseYear.$gte = parseInt(startYear);
            }
            if (endYear && !isNaN(endYear)) {
                matchStage.releaseYear.$lte = parseInt(endYear);
            }
        }

        // Only add match stage if there are filters
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Lookup stages for artist and genre
        pipeline.push(
            {
                $lookup: {
                    from: 'artists',
                    localField: 'artist',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            { $unwind: '$artist' },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genre',
                    foreignField: '_id',
                    as: 'genre'
                }
            },
            { $unwind: '$genre' }
        );

        // Execute the prepared aggregation
        const songs = await collection.aggregate(pipeline).toArray();

        // Calculate general statistics using raw MongoDB operation
        const generalStats = await collection.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalSongs: { $sum: 1 },
                    averageDuration: { $avg: '$duration' }
                }
            }
        ]).toArray();

        // Calculate songs per genre
        const genreStats = await collection.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genre',
                    foreignField: '_id',
                    as: 'genre'
                }
            },
            { $unwind: '$genre' },
            {
                $group: {
                    _id: '$genre.name',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // Convert genre stats array to object
        const songsPerGenre = {};
        genreStats.forEach(stat => {
            songsPerGenre[stat._id] = stat.count;
        });

        // Combine all statistics
        const stats = {
            ...(generalStats[0] || { totalSongs: 0, averageDuration: 0 }),
            songsPerGenre
        };

        res.json({
            songs,
            stats
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ 
            message: 'Error generating report',
            error: error.message 
        });
    }
});

// Get a single song by ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
            .populate('artist')
            .populate('genre');
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new song
router.post('/', async (req, res) => {
    try {
        // First, create or find the artist
        let artist;
        if (req.body.artistId) {
            artist = await Artist.findById(req.body.artistId);
        } else {
            artist = await Artist.findOne({ name: req.body.artistName });
            if (!artist) {
                artist = await Artist.create({
                    name: req.body.artistName,
                    country: req.body.artistCountry
                });
            }
        }

        // Create the song
        const song = await Song.create({
            title: req.body.title,
            duration: parseInt(req.body.duration),
            releaseYear: parseInt(req.body.releaseYear),
            artist: artist._id,
            genre: req.body.genreId
        });
        
        // Fetch the complete song data with populated fields
        const populatedSong = await Song.findById(song._id)
            .populate('artist')
            .populate('genre');
            
        res.status(201).json(populatedSong);
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a song (using ODM)
router.put('/:id', async (req, res) => {
    try {
        const updatedSong = await Song.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                duration: req.body.duration,
                releaseYear: req.body.releaseYear,
                artist: req.body.artistId,
                genre: req.body.genreId
            },
            { new: true }
        ).populate('artist').populate('genre');
        
        res.json(updatedSong);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a song (using ODM)
router.delete('/:id', async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;