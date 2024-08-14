const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Update the MongoDB connection URI to use 127.0.0.1
mongoose
  .connect("mongodb://127.0.0.1:27017/aniflix")  // Use 127.0.0.1 instead of localhost
  .then(() => {
    console.log("MongoDB connected Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("server started on port 5000");
});
