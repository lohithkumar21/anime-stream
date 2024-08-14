const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  likedMovies: Array,
  payment_day: {
    type: String,
    default: () => {
      const currentDate = new Date("2000-01-01");
      return `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    },
  },
  expire_day: {
    type: String,
    default: () => {
      const defaultExpireDate = new Date("2000-01-01");
      return `${String(defaultExpireDate.getDate()).padStart(2, '0')}/${String(defaultExpireDate.getMonth() + 1).padStart(2, '0')}/${defaultExpireDate.getFullYear()}`;
    },
  },
});

module.exports = mongoose.model("users", userSchema);
