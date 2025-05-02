const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');

// Get all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('name');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new genre
router.post('/', async (req, res) => {
    const genre = new Genre({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 