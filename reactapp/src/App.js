import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
} from 'reactstrap';

import Movie from './components/Movie'

function App() {

  const [moviesCount, setMoviesCount] = useState(0)
  const [moviesWishList, setMoviesWishList] = useState([])
  const [movieList, setMovieList] = useState([])
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const response = await fetch('/new-movies')
      const jsonResponse = await response.json()
      setMovieList(jsonResponse.movies)

      const responseWish = await fetch('wishlist-movie')
      const jsonResponseWish = await responseWish.json()

      const wishlistFromDB = jsonResponseWish.movies.map((movie, i) => {
        return { name: movie.movieName, img: movie.movieImg }
      })

      setMoviesWishList(wishlistFromDB)
      setMoviesCount(jsonResponseWish.movies.length)
    }
    loadData();

  }, [])

  const toggle = () => setPopoverOpen(!popoverOpen);

  const handleClickAddMovie = async (name, img) => {
    setMoviesCount(moviesCount + 1)
    setMoviesWishList([...moviesWishList, { name: name, img: img }])

    const response = await fetch('/wishlist-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${name}&img=${img}`
    })
  }

  const handleClickDeleteMovie = async (name) => {
    setMoviesCount(moviesCount - 1)
    setMoviesWishList(moviesWishList.filter(object => object.name != name))

    const response = await fetch(`/wishlist-movie/${name}`, {
      method: 'DELETE'
    })
  }

  const cardWish = moviesWishList.map((movie, i) => {
    return (
      <ListGroupItem>
        <ListGroupItemText style={{ cursor: "pointer" }} onClick={() => { handleClickDeleteMovie(movie.name) }}>
          <img width="25%" src={movie.img} /> {movie.name}
        </ListGroupItemText>
      </ListGroupItem>
    )
  })

  const movieListItems = movieList.map((movie, i) => {
    let isSee = moviesWishList.some(element => element.name == movie.title)

    let desc = movie.overview
    if (desc.length > 80) {
      desc = desc.substring(0, 80) + '...'
    }

    let urlImage = '/generique.jpg'
    if (movie.backdrop_path != null) {
      urlImage = 'https://image.tmdb.org/t/p/w500/' + movie.backdrop_path
    }
    return (<Movie key={i} movieSee={isSee} handleClickDeleteMovieParent={handleClickDeleteMovie} handleClickAddMovieParent={handleClickAddMovie} movieName={movie.title} movieDesc={desc} movieImg={urlImage} globalRating={movie.popularity} globalCountRating={movie.vote_count} />)
  })

  return (
    <div style={{ backgroundColor: "#232528" }}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{ color: 'white' }}>Last Releases</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button id="Popover1" type="button">{moviesCount} films</Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>WishList</PopoverHeader>
                <PopoverBody>
                  <ListGroup>
                    {cardWish}
                  </ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>
          {movieListItems}
        </Row>
      </Container>
    </div>
  );
}

export default App;
