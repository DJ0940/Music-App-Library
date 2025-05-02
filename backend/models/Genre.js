const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, { timestamps: false });

genreSchema.set('versionKey', false);

genreSchema.index({ name: 1 });

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre; 