const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    servings: {
        type: Number,
        required: 'This field is required.'
    },
    quantity: {
        type: Array,
        required: 'This field is required.'
    },
    ingredients: {
        type: Array,
        required: 'This field is required.'
    },
    categoryByServing: {
        type: String,
        enum: ['Reggeli', 'Ebéd', 'Vacsora', 'Desszert', 'Levesek', 'Egyéb'],
        required: 'This field is required.'
    },
    categoryByNationality: {
        type: String,
        enum: ['Thai', 'Kínai', 'Indiai', 'Olasz', 'Angol', 'Magyar', 'Egyéb'],
        required: 'This field is required.'
    },
    image: {
        type: Array,
        required: 'This field is required.'
    },
    comments: [
        {
            username: String,           
            comment: String,          
            date: {
                type: Date,
                default: Date.now
            },           
            rating: Number,
        },{
            timestamps: true
        }
    ],
    count: {
        type: Number
    },
    likes: {
        type: Number
    },
    ratingAvg: {
        type: Number
    },
    recipe_id: {
        type: String
    }

});



recipeSchema.index({name: 'text', description: 'text', ingredients: 'text', categoryByServing: 'text', categoryByNationality: 'text'});


module.exports = mongoose.model('Recipe', recipeSchema);