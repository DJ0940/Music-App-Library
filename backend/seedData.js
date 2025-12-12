const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Genre = require('./models/Genre');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/music_library', {
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

        // Add Modern Artists
        const artists = await Artist.insertMany([
            // Indie/Alternative R&B
            { name: 'keshi' },
            { name: 'Bazzi' },
            { name: 'ASTN' },
            { name: 'Jeremy Zucker' },
            { name: 'JVKE' },
            { name: 'mxmtoon' },
            { name: 'Lauv' },
            { name: 'Chelsea Cutler' },
            // Pop/R&B
            { name: 'The Weeknd' },
            { name: 'SZA' },
            { name: 'Frank Ocean' },
            { name: 'Brent Faiyaz' },
            { name: 'Summer Walker' },
            // K-Pop Modern
            { name: 'NewJeans' },
            { name: 'LE SSERAFIM' },
            { name: 'aespa' },
            { name: 'Stray Kids' },
            { name: 'ENHYPEN' },
            // Hip Hop/Rap
            { name: 'Travis Scott' },
            { name: '21 Savage' },
            { name: 'Lil Uzi Vert' },
            { name: 'Juice WRLD' },
            // Electronic/Pop
            { name: 'The Chainsmokers' },
            { name: 'Marshmello' },
            { name: 'Dua Lipa' },
            { name: 'Olivia Rodrigo' },
            // Alternative/Rock
            { name: 'Cigarettes After Sex' },
            { name: 'Arctic Monkeys' },
            { name: 'The Neighbourhood' },
            { name: 'Chase Atlantic' }
        ]);

        // Add Genres
        const genres = await Genre.insertMany([
            { name: 'Indie' },
            { name: 'R&B' },
            { name: 'Pop' },
            { name: 'K-pop' },
            { name: 'Hip Hop' },
            { name: 'Electronic' },
            { name: 'Alternative' },
            { name: 'Rock' }
        ]);

        // Add Modern Songs
        const songs = await Song.insertMany([
            // keshi
            { title: 'LIMBO', duration: 174, releaseYear: 2022, artist: artists[0]._id, genre: genres[0]._id },
            { title: 'TOUCH', duration: 193, releaseYear: 2022, artist: artists[0]._id, genre: genres[0]._id },
            { title: 'SOMEBODY', duration: 156, releaseYear: 2022, artist: artists[0]._id, genre: genres[0]._id },
            { title: 'like i need u', duration: 187, releaseYear: 2019, artist: artists[0]._id, genre: genres[0]._id },
            
            // Bazzi
            { title: 'Mine', duration: 131, releaseYear: 2018, artist: artists[1]._id, genre: genres[2]._id },
            { title: 'Paradise', duration: 205, releaseYear: 2018, artist: artists[1]._id, genre: genres[2]._id },
            { title: 'Beautiful', duration: 184, releaseYear: 2018, artist: artists[1]._id, genre: genres[2]._id },
            
            // ASTN
            { title: 'I Dont Love You', duration: 168, releaseYear: 2023, artist: artists[2]._id, genre: genres[1]._id },
            { title: 'Am I Supposed to Apologize?', duration: 172, releaseYear: 2022, artist: artists[2]._id, genre: genres[1]._id },
            { title: 'Moot', duration: 163, releaseYear: 2023, artist: artists[2]._id, genre: genres[1]._id },
            
            // Jeremy Zucker
            { title: 'comethru', duration: 179, releaseYear: 2018, artist: artists[3]._id, genre: genres[0]._id },
            { title: 'you were good to me', duration: 211, releaseYear: 2019, artist: artists[3]._id, genre: genres[0]._id },
            { title: 'always i will care', duration: 202, releaseYear: 2021, artist: artists[3]._id, genre: genres[0]._id },
            
            // JVKE
            { title: 'golden hour', duration: 208, releaseYear: 2022, artist: artists[4]._id, genre: genres[2]._id },
            { title: 'this is what falling in love feels like', duration: 136, releaseYear: 2021, artist: artists[4]._id, genre: genres[2]._id },
            { title: 'upside down', duration: 194, releaseYear: 2023, artist: artists[4]._id, genre: genres[2]._id },
            
            // mxmtoon
            { title: 'prom dress', duration: 190, releaseYear: 2018, artist: artists[5]._id, genre: genres[0]._id },
            { title: 'feelings are fatal', duration: 173, releaseYear: 2019, artist: artists[5]._id, genre: genres[0]._id },
            { title: 'bon iver', duration: 167, releaseYear: 2020, artist: artists[5]._id, genre: genres[0]._id },
            
            // Lauv
            { title: 'I Like Me Better', duration: 197, releaseYear: 2017, artist: artists[6]._id, genre: genres[2]._id },
            { title: 'fuck i am lonely', duration: 203, releaseYear: 2019, artist: artists[6]._id, genre: genres[2]._id },
            { title: 'Tattoos Together', duration: 202, releaseYear: 2020, artist: artists[6]._id, genre: genres[2]._id },
            
            // Chelsea Cutler
            { title: 'Your Shirt', duration: 207, releaseYear: 2019, artist: artists[7]._id, genre: genres[0]._id },
            { title: 'Crazier Things', duration: 192, releaseYear: 2020, artist: artists[7]._id, genre: genres[0]._id },
            
            // The Weeknd
            { title: 'Blinding Lights', duration: 200, releaseYear: 2019, artist: artists[8]._id, genre: genres[1]._id },
            { title: 'Die For You', duration: 260, releaseYear: 2016, artist: artists[8]._id, genre: genres[1]._id },
            { title: 'Save Your Tears', duration: 215, releaseYear: 2020, artist: artists[8]._id, genre: genres[1]._id },
            { title: 'Starboy', duration: 230, releaseYear: 2016, artist: artists[8]._id, genre: genres[1]._id },
            
            // SZA
            { title: 'Kill Bill', duration: 153, releaseYear: 2022, artist: artists[9]._id, genre: genres[1]._id },
            { title: 'Snooze', duration: 201, releaseYear: 2023, artist: artists[9]._id, genre: genres[1]._id },
            { title: 'Good Days', duration: 279, releaseYear: 2020, artist: artists[9]._id, genre: genres[1]._id },
            { title: 'The Weekend', duration: 254, releaseYear: 2017, artist: artists[9]._id, genre: genres[1]._id },
            
            // Frank Ocean
            { title: 'Thinkin Bout You', duration: 201, releaseYear: 2012, artist: artists[10]._id, genre: genres[1]._id },
            { title: 'Ivy', duration: 249, releaseYear: 2016, artist: artists[10]._id, genre: genres[1]._id },
            { title: 'Nights', duration: 307, releaseYear: 2016, artist: artists[10]._id, genre: genres[1]._id },
            
            // Brent Faiyaz
            { title: 'Dead Man Walking', duration: 224, releaseYear: 2022, artist: artists[11]._id, genre: genres[1]._id },
            { title: 'Gravity', duration: 232, releaseYear: 2023, artist: artists[11]._id, genre: genres[1]._id },
            { title: 'Wasting Time', duration: 176, releaseYear: 2021, artist: artists[11]._id, genre: genres[1]._id },
            
            // Summer Walker
            { title: 'Playing Games', duration: 189, releaseYear: 2019, artist: artists[12]._id, genre: genres[1]._id },
            { title: 'Girls Need Love', duration: 170, releaseYear: 2019, artist: artists[12]._id, genre: genres[1]._id },
            { title: 'Ex For A Reason', duration: 181, releaseYear: 2021, artist: artists[12]._id, genre: genres[1]._id },
            
            // NewJeans
            { title: 'OMG', duration: 213, releaseYear: 2023, artist: artists[13]._id, genre: genres[3]._id },
            { title: 'Ditto', duration: 185, releaseYear: 2022, artist: artists[13]._id, genre: genres[3]._id },
            { title: 'Attention', duration: 180, releaseYear: 2022, artist: artists[13]._id, genre: genres[3]._id },
            { title: 'Hype Boy', duration: 178, releaseYear: 2022, artist: artists[13]._id, genre: genres[3]._id },
            
            // LE SSERAFIM
            { title: 'UNFORGIVEN', duration: 181, releaseYear: 2023, artist: artists[14]._id, genre: genres[3]._id },
            { title: 'ANTIFRAGILE', duration: 188, releaseYear: 2022, artist: artists[14]._id, genre: genres[3]._id },
            { title: 'Perfect Night', duration: 202, releaseYear: 2023, artist: artists[14]._id, genre: genres[3]._id },
            
            // aespa
            { title: 'Spicy', duration: 190, releaseYear: 2023, artist: artists[15]._id, genre: genres[3]._id },
            { title: 'Savage', duration: 235, releaseYear: 2021, artist: artists[15]._id, genre: genres[3]._id },
            { title: 'Next Level', duration: 210, releaseYear: 2021, artist: artists[15]._id, genre: genres[3]._id },
            
            // Stray Kids
            { title: 'S-Class', duration: 177, releaseYear: 2023, artist: artists[16]._id, genre: genres[3]._id },
            { title: 'Gods Menu', duration: 188, releaseYear: 2020, artist: artists[16]._id, genre: genres[3]._id },
            { title: 'MANIAC', duration: 172, releaseYear: 2022, artist: artists[16]._id, genre: genres[3]._id },
            
            // ENHYPEN
            { title: 'Bite Me', duration: 188, releaseYear: 2023, artist: artists[17]._id, genre: genres[3]._id },
            { title: 'Polaroid Love', duration: 188, releaseYear: 2021, artist: artists[17]._id, genre: genres[3]._id },
            { title: 'Drunk-Dazed', duration: 196, releaseYear: 2021, artist: artists[17]._id, genre: genres[3]._id },
            
            // Travis Scott
            { title: 'SICKO MODE', duration: 312, releaseYear: 2018, artist: artists[18]._id, genre: genres[4]._id },
            { title: 'goosebumps', duration: 243, releaseYear: 2016, artist: artists[18]._id, genre: genres[4]._id },
            { title: 'FE!N', duration: 189, releaseYear: 2023, artist: artists[18]._id, genre: genres[4]._id },
            
            // 21 Savage
            { title: 'a lot', duration: 288, releaseYear: 2018, artist: artists[19]._id, genre: genres[4]._id },
            { title: 'redrum', duration: 264, releaseYear: 2024, artist: artists[19]._id, genre: genres[4]._id },
            { title: 'Bank Account', duration: 220, releaseYear: 2017, artist: artists[19]._id, genre: genres[4]._id },
            
            // Lil Uzi Vert
            { title: 'XO Tour Llif3', duration: 183, releaseYear: 2017, artist: artists[20]._id, genre: genres[4]._id },
            { title: 'Just Wanna Rock', duration: 121, releaseYear: 2022, artist: artists[20]._id, genre: genres[4]._id },
            { title: 'Money Longer', duration: 205, releaseYear: 2016, artist: artists[20]._id, genre: genres[4]._id },
            
            // Juice WRLD
            { title: 'Lucid Dreams', duration: 239, releaseYear: 2018, artist: artists[21]._id, genre: genres[4]._id },
            { title: 'All Girls Are The Same', duration: 165, releaseYear: 2018, artist: artists[21]._id, genre: genres[4]._id },
            { title: 'Robbery', duration: 240, releaseYear: 2019, artist: artists[21]._id, genre: genres[4]._id },
            
            // The Chainsmokers
            { title: 'Closer', duration: 244, releaseYear: 2016, artist: artists[22]._id, genre: genres[5]._id },
            { title: 'Do Not Let Me Down', duration: 208, releaseYear: 2016, artist: artists[22]._id, genre: genres[5]._id },
            { title: 'Something Just Like This', duration: 247, releaseYear: 2017, artist: artists[22]._id, genre: genres[5]._id },
            
            // Marshmello
            { title: 'Happier', duration: 214, releaseYear: 2018, artist: artists[23]._id, genre: genres[5]._id },
            { title: 'Silence', duration: 181, releaseYear: 2017, artist: artists[23]._id, genre: genres[5]._id },
            { title: 'Alone', duration: 263, releaseYear: 2016, artist: artists[23]._id, genre: genres[5]._id },
            
            // Dua Lipa
            { title: 'Levitating', duration: 203, releaseYear: 2020, artist: artists[24]._id, genre: genres[2]._id },
            { title: 'Do Not Start Now', duration: 183, releaseYear: 2019, artist: artists[24]._id, genre: genres[2]._id },
            { title: 'Dance The Night', duration: 177, releaseYear: 2023, artist: artists[24]._id, genre: genres[2]._id },
            
            // Olivia Rodrigo
            { title: 'drivers license', duration: 242, releaseYear: 2021, artist: artists[25]._id, genre: genres[2]._id },
            { title: 'good 4 u', duration: 178, releaseYear: 2021, artist: artists[25]._id, genre: genres[2]._id },
            { title: 'vampire', duration: 219, releaseYear: 2023, artist: artists[25]._id, genre: genres[2]._id },
            
            // Cigarettes After Sex
            { title: 'Apocalypse', duration: 297, releaseYear: 2017, artist: artists[26]._id, genre: genres[6]._id },
            { title: 'K.', duration: 267, releaseYear: 2017, artist: artists[26]._id, genre: genres[6]._id },
            { title: 'Sunsetz', duration: 337, releaseYear: 2017, artist: artists[26]._id, genre: genres[6]._id },
            
            // Arctic Monkeys
            { title: 'Do I Wanna Know?', duration: 272, releaseYear: 2013, artist: artists[27]._id, genre: genres[7]._id },
            { title: 'Why Would You Only Call Me When You Are High?', duration: 161, releaseYear: 2013, artist: artists[27]._id, genre: genres[7]._id },
            { title: '505', duration: 253, releaseYear: 2007, artist: artists[27]._id, genre: genres[7]._id },
            
            // The Neighbourhood
            { title: 'Sweater Weather', duration: 240, releaseYear: 2013, artist: artists[28]._id, genre: genres[6]._id },
            { title: 'Daddy Issues', duration: 260, releaseYear: 2015, artist: artists[28]._id, genre: genres[6]._id },
            { title: 'Afraid', duration: 193, releaseYear: 2013, artist: artists[28]._id, genre: genres[6]._id },
            
            // Chase Atlantic
            { title: 'Swim', duration: 239, releaseYear: 2017, artist: artists[29]._id, genre: genres[6]._id },
            { title: 'Friends', duration: 191, releaseYear: 2018, artist: artists[29]._id, genre: genres[6]._id },
            { title: 'Into It', duration: 226, releaseYear: 2020, artist: artists[29]._id, genre: genres[6]._id }
        ]);

        // Add Modern Playlists
        await Playlist.insertMany([
            {
                name: 'Late Night Vibes',
                description: 'Perfect for those late night study or drive sessions',
                songs: [
                    { song: songs[0]._id, addedAt: new Date() },  // keshi - LIMBO
                    { song: songs[7]._id, addedAt: new Date() },  // ASTN - I Dont Love You
                    { song: songs[10]._id, addedAt: new Date() }, // Jeremy Zucker - comethru
                    { song: songs[33]._id, addedAt: new Date() }  // Frank Ocean - Ivy
                ]
            },
            {
                name: 'Indie Feels',
                description: 'Modern indie artists that hit different',
                songs: [
                    { song: songs[1]._id, addedAt: new Date() },  // keshi - TOUCH
                    { song: songs[16]._id, addedAt: new Date() }, // mxmtoon - prom dress
                    { song: songs[22]._id, addedAt: new Date() }, // Chelsea Cutler - Your Shirt
                    { song: songs[11]._id, addedAt: new Date() }  // Jeremy Zucker - you were good to me
                ]
            },
            {
                name: 'R&B Essentials',
                description: 'The best modern R&B tracks',
                songs: [
                    { song: songs[24]._id, addedAt: new Date() }, // The Weeknd - Blinding Lights
                    { song: songs[28]._id, addedAt: new Date() }, // SZA - Kill Bill
                    { song: songs[35]._id, addedAt: new Date() }, // Brent Faiyaz - Dead Man Walking
                    { song: songs[38]._id, addedAt: new Date() }  // Summer Walker - Playing Games
                ]
            },
            {
                name: 'K-Pop Modern',
                description: '2023-2024 K-Pop hits',
                songs: [
                    { song: songs[41]._id, addedAt: new Date() }, // NewJeans - OMG
                    { song: songs[45]._id, addedAt: new Date() }, // LE SSERAFIM - UNFORGIVEN
                    { song: songs[48]._id, addedAt: new Date() }, // aespa - Spicy
                    { song: songs[51]._id, addedAt: new Date() }  // Stray Kids - S-Class
                ]
            },
            {
                name: 'Hype Energy',
                description: 'High energy tracks to get you pumped',
                songs: [
                    { song: songs[57]._id, addedAt: new Date() }, // Travis Scott - SICKO MODE
                    { song: songs[63]._id, addedAt: new Date() }, // Lil Uzi Vert - XO Tour Llif3
                    { song: songs[52]._id, addedAt: new Date() }, // Stray Kids - God's Menu
                    { song: songs[79]._id, addedAt: new Date() }  // Olivia Rodrigo - good 4 u
                ]
            },
            {
                name: 'Chill Bedroom Pop',
                description: 'Soft, dreamy tracks for relaxation',
                songs: [
                    { song: songs[4]._id, addedAt: new Date() },  // Bazzi - Mine
                    { song: songs[13]._id, addedAt: new Date() }, // JVKE - golden hour
                    { song: songs[19]._id, addedAt: new Date() }, // Lauv - I Like Me Better
                    { song: songs[17]._id, addedAt: new Date() }  // mxmtoon - feelings are fatal
                ]
            },
            {
                name: 'Alternative Mood',
                description: 'Dark, moody alternative tracks',
                songs: [
                    { song: songs[81]._id, addedAt: new Date() }, // Cigarettes After Sex - Apocalypse
                    { song: songs[84]._id, addedAt: new Date() }, // Arctic Monkeys - Do I Wanna Know?
                    { song: songs[87]._id, addedAt: new Date() }, // The Neighbourhood - Sweater Weather
                    { song: songs[90]._id, addedAt: new Date() }  // Chase Atlantic - Swim
                ]
            },
            {
                name: 'Pop Party',
                description: 'Upbeat pop hits for any occasion',
                songs: [
                    { song: songs[75]._id, addedAt: new Date() }, // Dua Lipa - Levitating
                    { song: songs[69]._id, addedAt: new Date() }, // The Chainsmokers - Closer
                    { song: songs[72]._id, addedAt: new Date() }, // Marshmello - Happier
                    { song: songs[78]._id, addedAt: new Date() }  // Olivia Rodrigo - drivers license
                ]
            }
        ]);

        console.log('Modern sample data added successfully!');
        console.log(`- ${artists.length} artists`);
        console.log(`- ${songs.length} songs`);
        console.log('- 8 curated playlists');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
