import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MoviePage from "./pages/Movies";
import Aniflix from "./pages/Aniflix";
import Player from "./pages/Player";
import Signup from "./pages/Signup";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";
import ChosenMovie from "./pages/ChosenMovie";
import PaymentDetails from "./pages/PaymentDeatils";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/player" element={<Player />} />
        <Route exact path="/tv" element={<TVShows />} />
        <Route exact path="/movies" element={<MoviePage />} />
        <Route exact path="/new" element={<Player />} />
        <Route exact path="/mylist" element={<UserListedMovies />} />
        <Route exact path="/" element={<Aniflix />} />
        <Route exact path="/paymentdetails" element={<PaymentDetails />} />
        <Route exact path="/chosen/:type/:id" element={<ChosenMovie />} /> 
      </Routes>
    </BrowserRouter>
  );
}
