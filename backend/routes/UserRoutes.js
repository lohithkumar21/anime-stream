const {
  addToLikedMovies,
  getLikedMovies,
  removeFromLikedMovies,
  updatePaymentInfo,
  checkAndCreateUser,
  getExpireDateOfCurrentUser,
} = require("../controllers/UserController");

const router = require("express").Router();

router.get("/liked/:email", getLikedMovies);
router.post("/add", addToLikedMovies);
router.put("/remove", removeFromLikedMovies);
router.put("/updatePaymentInfo", updatePaymentInfo);
router.post("/checkAndCreateUser", checkAndCreateUser);
router.get("/expireDate/:email", getExpireDateOfCurrentUser);

module.exports = router;
