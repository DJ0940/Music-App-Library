const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    songs: [{
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: false });

playlistSchema.set('versionKey', false);

// Create indexes for common queries
playlistSchema.index({ name: 1 });
playlistSchema.index({ 'songs.song': 1 });

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist; 