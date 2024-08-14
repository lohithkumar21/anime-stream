import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import NotAvailable from "../components/NotAvailable";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";

function MoviePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const movies = useSelector((state) => state.aniflix.movies);
  const genres = useSelector((state) => state.aniflix.genres);
  const genresLoaded = useSelector((state) => state.aniflix.genresLoaded);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "movie" }));
    }
  }, [genresLoaded, dispatch, genres]);

  useEffect(() => {
    if (searchQuery) {
      // Filter movies based on the search query
      dispatch(fetchMovies({ genres, type: "movie", query: searchQuery }));
    }
  }, [searchQuery, dispatch, genres]);

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) setUser(currentUser.uid);
      else navigate("/login");
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} onSearch={setSearchQuery} />
      <Content>
        {movies && movies.length ? <Slider movies={movies} /> : <NotAvailable />}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  .navbar {
    position: fixed;
    width: 100%;
    z-index: 10;
  }
`;

const Content = styled.div`
  margin-top: 8rem;
  padding: 2rem;

  .not-available {
    text-align: center;
    color: white;
    margin-top: 4rem;
  }
`;

export default MoviePage;
