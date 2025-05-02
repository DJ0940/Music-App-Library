const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true // Index for title searches
    },
    duration: {
        type: Number,  // duration in seconds
        required: true,
        min: 0
    },
    releaseYear: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
        index: true // Index for year-based queries
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
        index: true // Index for artist lookups
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
        index: true // Index for genre lookups
    }
}, { timestamps: false, versionKey: false });

// Create compound indexes for common queries
songSchema.index({ title: 1, artist: 1 });
songSchema.index({ releaseYear: -1 });
songSchema.index({ genre: 1 });

// Compound index for common queries
songSchema.index({ artist: 1, genre: 1 });
songSchema.index({ releaseYear: 1, genre: 1 });

const Song = mongoose.model('Song', songSchema);
module.exports = Song; 