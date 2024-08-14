import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import movieTrailer from "movie-trailer";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  expireDay: "01/01/2000",
};

export const getGenres = createAsyncThunk("aniflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );
  return genres;
});

const createArrayFromRawData = async (array, moviesArray, genres) => {
  const animationGenreId = 16; // Animation genre ID
  
  for (const movie of array) {
    // Check if movie includes the animation genre
    if (movie.genre_ids.includes(animationGenreId)) {
      // Map genre ids to genre names
      const movieGenres = movie.genre_ids.map((genre) => {
        const genreObj = genres.find(({ id }) => id === genre);
        return genreObj ? genreObj.name : null;
      }).filter(name => name); // Filter out null values

      if (movie.backdrop_path) {
        // Determine videoType
        const videoType = movie.original_title ? 'movie' : 'tv'; // Simplified logic

        // Initialize movie data
        const movieData = {
          id: movie.id,
          name: movie.title || movie.name,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3), // Limit genres to first 3
          overview: movie.overview || "No overview available",
          popularity: movie.popularity !== undefined ? movie.popularity.toFixed(1) : "Not available",
          adult: movie.adult !== undefined ? movie.adult : false,
          imdb: movie.imdb_id || "N/A",
          release_date:movie.release_date,
          runtime: movie.runtime || 0,
          video: movie.video || false,
          vote_average: movie.vote_average || 0,
          vote_count: movie.vote_count || 0,
          videoType: videoType, // Add videoType
          videoUrl: "" // Placeholder for video URL
        };

        // Fetch trailer URL
        try {
          const url = await movieTrailer(movieData.name, { videoType: videoType, id: true });
          if (url) {
            movieData.videoUrl = `https://www.youtube.com/watch?v=${url}`;
          }
        } catch (error) {
          console.error("Error fetching trailer:", error);
        }
        moviesArray.push(movieData);
      }
    }
  }
};


const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 150 && i < 30; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    await createArrayFromRawData(results, moviesArray, genres); // Await to ensure trailers are fetched
  }
  return moviesArray;
};


export const fetchMovies = createAsyncThunk(
  "aniflix/trending",
  async ({ type }, thunkAPI) => {
    const {
      aniflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const getUsersLikedMovies = createAsyncThunk(
  "aniflix/getLiked",
  async (email) => {
    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
    return movies;
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "aniflix/deleteLiked",
  async ({ movieId, email }) => {
    const {
      data: { movies },
    } = await axios.put("http://localhost:5000/api/user/remove", {
      email,
      movieId,
    });
    return movies;
  }
);

export const updatePaymentInfo = createAsyncThunk(
  "aniflix/updatePaymentInfo",
  async ({ email, payment_day, expire_day }) => {
    const {
      data: { msg },
    } = await axios.put("http://localhost:5000/api/user/updatePaymentInfo", {
      email,
      payment_day,
      expire_day,
    });
    return msg;
  }
);

export const checkAndCreateUser = createAsyncThunk(
  "aniflix/checkAndCreateUser",
  async (email) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/checkAndCreateUser", { email });
      return response.data;
    } catch (error) {
      // Handle the error appropriately
      throw new Error(error.response ? error.response.data.msg : "Error checking or creating user.");
    }
  }
);

export const getExpireDateOfCurrentUser = createAsyncThunk(
  "aniflix/getExpireDateOfCurrentUser",
  async (email) => {
    const {
      data: { expire_day },
    } = await axios.get(`http://localhost:5000/api/user/expireDate/${email}`);
    return expire_day;
  }
);

const aniflixSlice = createSlice({
  name: "aniflix",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getExpireDateOfCurrentUser.fulfilled, (state, action) => {
      state.expireDay = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    aniflix: aniflixSlice.reducer,
  },
});

export const { setGenres, setMovies } = aniflixSlice.actions;
