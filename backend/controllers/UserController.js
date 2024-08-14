const User = require("../models/UserModel");

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else {
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    return res.json({ msg: "Error fetching movies." });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else {
        return res.json({ msg: "Movie already added to the liked list." });
      }
    } else {
      await User.create({ email, likedMovies: [data] });
    }
    return res.json({ msg: "Movie successfully added to liked list." });
  } catch (error) {
    return res.json({ msg: "Error adding movie to the liked list." });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "User with given email not found." });
    }

    const movies = user.likedMovies;
    const movieIndex = movies.findIndex(({ id }) => id === movieId);

    if (movieIndex === -1) {
      return res.status(400).json({ msg: "Movie not found." });
    }

    movies.splice(movieIndex, 1);

    await User.findByIdAndUpdate(
      user._id,
      { likedMovies: movies },
      { new: true }
    );

    return res.json({ msg: "Movie successfully removed.", movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error removing movie from the liked list." });
  }
};

module.exports.updatePaymentInfo = async (req, res) => {
  try {
    const { email, payment_day, expire_day } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      user.payment_day = payment_day;
      user.expire_day = expire_day;
      await user.save();
      return res.json({ msg: "Payment info updated successfully." });
    } else {
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    return res.json({ msg: "Error updating payment info." });
  }
};

module.exports.checkAndCreateUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if none exists
      user = await User.create({ email, likedMovies: [] });
      return res.json({ msg: "User created successfully.", user });
    }

    return res.json({ msg: "User already exists.", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error checking or creating user." });
  }
};

module.exports.getExpireDateOfCurrentUser = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ expire_day: user.expire_day });
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error fetching expire date." });
  }
};