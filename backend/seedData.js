const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Genre = require('./models/Genre');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/music_collection', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

const seedData = async () => {
    try {
        // Clear existing data
        await Promise.all([
            Artist.deleteMany({}),
            Genre.deleteMany({}),
            Song.deleteMany({}),
            Playlist.deleteMany({})
        ]);

        // Add Artists
        const artists = await Artist.insertMany([
            { name: 'The Beatles' },
            { name: 'Queen' },
            { name: 'Michael Jackson' },
            { name: 'Taylor Swift' },
            { name: 'Ed Sheeran' }
        ]);

        // Add Genres
        const genres = await Genre.insertMany([
            { name: 'Rock' },
            { name: 'Pop' },
            { name: 'Jazz' },
            { name: 'Hip Hop' },
            { name: 'Classical' },
            { name: 'J-pop'},
            { name: 'K-pop'}
        ]);

        // Add Songs
        const songs = await Song.insertMany([
            {
                title: 'Hey Jude',
                duration: 431,
                releaseYear: 1968,
                artist: artists[0]._id,
                genre: genres[0]._id
            },
            {
                title: 'Bohemian Rhapsody',
                duration: 354,
                releaseYear: 1975,
                artist: artists[1]._id,
                genre: genres[0]._id
            },
            {
                title: 'Billie Jean',
                duration: 294,
                releaseYear: 1983,
                artist: artists[2]._id,
                genre: genres[1]._id
            },
            {
                title: 'Shake It Off',
                duration: 219,
                releaseYear: 2014,
                artist: artists[3]._id,
                genre: genres[1]._id
            },
            {
                title: 'Shape of You',
                duration: 233,
                releaseYear: 2017,
                artist: artists[4]._id,
                genre: genres[1]._id
            },
            {
                title: 'Yesterday',
                duration: 125,
                releaseYear: 1965,
                artist: artists[0]._id,
                genre: genres[0]._id
            },
            {
                title: 'We Will Rock You',
                duration: 122,
                releaseYear: 1977,
                artist: artists[1]._id,
                genre: genres[0]._id
            }
        ]);

        // Add Sample Playlists
        await Playlist.insertMany([
            {
                name: 'Classic Rock Hits',
                description: 'The best rock songs from the 60s and 70s',
                songs: [
                    { song: songs[0]._id, addedAt: new Date() },
                    { song: songs[1]._id, addedAt: new Date() },
                    { song: songs[6]._id, addedAt: new Date() }
                ]
            },
            {
                name: 'Pop Favorites',
                description: 'Popular hits from various decades',
                songs: [
                    { song: songs[2]._id, addedAt: new Date() },
                    { song: songs[3]._id, addedAt: new Date() },
                    { song: songs[4]._id, addedAt: new Date() }
                ]
            }
        ]);

        console.log('Sample data added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 