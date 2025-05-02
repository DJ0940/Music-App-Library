const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: v => v.toLowerCase() // to lowercase when saving
    }
}, { 
    timestamps: false,
    toJSON: {
        transform: function(doc, ret) {
            // Capitalize first letter of each word in name
            ret.name = ret.name.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return ret;
        }
    }
});

artistSchema.set('versionKey', false);

// Create a case-insensitive index on the name field
artistSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });

const Artist = mongoose.model('Artist', artistSchema);
module.exports = Artist; 