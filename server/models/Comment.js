const { Double } = require('bson');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'This field is required.'
    },
    comment: {
        type: String,
        required: 'This field is required.'
    },
    time: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number
    },
    recipe_id: {
        type: String
    },
});


module.exports = mongoose.model('Comment', commentSchema);