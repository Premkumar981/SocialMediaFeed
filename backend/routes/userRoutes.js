const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

router.post("/create", createUser);
router.get("/", getUsers);
router.post("/:targetId/follow", followUser);
router.post("/:targetId/unfollow", unfollowUser);

module.exports = router;
