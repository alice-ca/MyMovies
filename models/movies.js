const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    movieName: String,
    movieImg: String
})

const movieModel = mongoose.model('movies', movieSchema)

module.exports = movieModel;