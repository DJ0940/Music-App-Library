const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

// Get all artists
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find().sort('name');
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new artist or find existing one
router.post('/', async (req, res) => {
    try {
        // Log the incoming request
        console.log('Creating/finding artist:', req.body);

        // Validate required fields
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // first, try to find an existing artist with case-insensitive name match
        let artist = await Artist.findOne({
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
        });

        console.log('Existing artist found:', artist);

        if (!artist) {
            // If no artist found, create a new one
            artist = new Artist({
                name: req.body.name
            });
            await artist.save();
            console.log('New artist created:', artist);
        }

        res.status(201).json(artist);
    } catch (error) {
        console.error('Error creating/finding artist:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 