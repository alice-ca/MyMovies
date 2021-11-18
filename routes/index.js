const express = require('express');
const router = express.Router();
const request = require('sync-request')

const movieModel = require('../models/movies')

//RECUPERER LA LISTE DES FILMS
router.get('/new-movies', function (req, res, next) {
  const data = request('GET', `https://api.themoviedb.org/3/discover/movie?api_key=5be011c13bc5f9530cded6bac358b420&language=fr-FR&region=FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
  const dataParse = JSON.parse(data.body)
  res.json({ result: true, movies: dataParse.results })
});

//AJOUT D'UN FILM DANS LA WISHLIST
router.post('/wishlist-movie', async function (req, res, next) {

  const newMovie = new movieModel({
    movieName: req.body.name,
    movieImg: req.body.img
  })

  const movieSave = await newMovie.save()

  let result = false
  if (movieSave.movieName) {
    result = true
  }

  res.json({ result })
});

//SUPPRIMER UN FILM DE LA WISHLIST
router.delete('/wishlist-movie/:name', async function (req, res, next) {

  const returnDb = await movieModel.deleteOne({ movieName: req.params.name })

  let result = false
  if (returnDb.deletedCount == 1) {
    result = true
  }

  res.json({ result })
});

//RECUPERER LA WISHLIST
router.get('/wishlist-movie', async function (req, res, next) {

  const movies = await movieModel.find()

  res.json({ movies })
});

module.exports = router;
