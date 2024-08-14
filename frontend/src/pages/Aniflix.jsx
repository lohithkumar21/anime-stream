import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres, checkAndCreateUser, getExpireDateOfCurrentUser } from "../store";
import { FaPlay } from "react-icons/fa";
import Slider from "../components/Slider";
import backgroundImage from "../assets/home.jpg";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import { parse, isBefore } from 'date-fns';
import BuySubscription from "../components/BuySubscription"; // Import the BuySubscription component

function Aniflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(backgroundImage);
  const [videoId, setVideoId] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [expireDay, setExpireDay] = useState(""); // Add state for expireDay
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false); // State to manage subscription status

  const movies = useSelector((state) => state.aniflix.movies);
  const genres = useSelector((state) => state.aniflix.genres);
  const genresLoaded = useSelector((state) => state.aniflix.genresLoaded);
  const expireDayFromStore = useSelector((state) => state.aniflix.expireDay); // Select expireDay from Redux store

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
    }
  }, [genresLoaded, dispatch, genres]);

  useEffect(() => {
    if (movies.length > 0) {
      const savedMovie = localStorage.getItem("selectedMovie");
      if (savedMovie) {
        const movie = JSON.parse(savedMovie);
        setSelectedMovie(movie);
        setCurrentBackground(`https://image.tmdb.org/t/p/original${movie.image}`);
        fetchVideo(movie);
      } else {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setSelectedMovie(randomMovie);
        setCurrentBackground(`https://image.tmdb.org/t/p/original${randomMovie.image}`);
        fetchVideo(randomMovie);
        localStorage.setItem("selectedMovie", JSON.stringify(randomMovie));
      }
    }
  }, [movies]);

  useEffect(() => {
    const id = setInterval(() => {
      if (movies.length > 0) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setSelectedMovie(randomMovie);
        setCurrentBackground(`https://image.tmdb.org/t/p/original${randomMovie.image}`);
        fetchVideo(randomMovie);
        localStorage.setItem("selectedMovie", JSON.stringify(randomMovie));
      }
    }, 60000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [movies]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        dispatch(checkAndCreateUser(currentUser.email));
        dispatch(getExpireDateOfCurrentUser(currentUser.email)); // Dispatch to fetch expireDay
      }
    });
    return () => unsubscribe();
  }, [navigate, dispatch]);

  useEffect(() => {
    if (expireDayFromStore) {
      setExpireDay(expireDayFromStore);
      console.log(expireDayFromStore);
      
      // Convert expireDay and current date to Date objects
      const expireDate = parse(expireDayFromStore, 'dd/MM/yyyy', new Date());
      const currentDate = new Date();
      
      // Check if the subscription is expired
      setIsSubscriptionExpired(isBefore(expireDate, currentDate));
    }
  }, [expireDayFromStore]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchVideo = async (movie) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/${movie.videoType}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
      );
      const { results } = response.data;
      if (results && results.length > 0) {
        const trailer = results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );
        if (trailer) {
          setVideoId(trailer.key);
        }
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const getTruncatedOverview = (overview) => {
    return overview.length > 200 ? `${overview.substring(0, 200)}...` : overview;
  };

  const handlePlayClick = () => {
    if (videoId) {
      navigate("/player", { state: { videoId } });
    }
  };

  if (isSubscriptionExpired) {
    return <BuySubscription />;
  }

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="hero">
        <img
          src={currentBackground}
          alt="background"
          className="background-image"
        />
        <div className="container">
          <div className="title">
            <h1>{selectedMovie ? selectedMovie.name : "Attack on Titan"}</h1>
          </div>
          <div className="buttons flex">
            <button
              onClick={handlePlayClick}
              className="play-button flex j-center a-center"
            >
              <FaPlay />
            </button>
            {selectedMovie && (
              <div className="movie-info">
                <span className="popularity">Popularity: {selectedMovie.popularity}</span>
                <span className="adult">Adult: {selectedMovie.adult ? "Yes" : "No"}</span>
              </div>
            )}
          </div>
          {selectedMovie && (
            <div className="overview">
              <p>{getTruncatedOverview(selectedMovie.overview)}</p>
            </div>
          )}
        </div>
      </div>
      <Slider movies={movies} />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;

  .hero {
    position: relative;

    .background-image {
      filter: brightness(60%);
      height: 100vh;
      width: 100vw;
      object-fit: cover;
    }

    .container {
      position: absolute;
      bottom: 5rem;
      left: 5rem;
      display: flex;
      flex-direction: column;
      max-width: 50rem;
      color: white;

      .title {
        margin-bottom: 2rem;

        h1 {
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
      }

      .buttons {
        display: flex;
        align-items: center;
        gap: 2rem;

        .play-button {
          background-color: rgba(255, 0, 0, 0.8);
          color: white;
          width: 5rem;
          height: 5rem;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

          &:hover {
            background-color: rgba(255, 0, 0, 1);
            transform: scale(1.1);
          }

          svg {
            font-size: 2rem;
          }
        }

        .movie-info {
          color: white;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
        }
      }

      .overview {
        margin-top: 2rem;
        font-size: 1.2rem;
        line-height: 1.5;
      }
    }
  }
`;

export default Aniflix;
