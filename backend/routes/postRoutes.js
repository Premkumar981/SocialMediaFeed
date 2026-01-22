const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
} = require("../controllers/postController");

router.post("/create", createPost);
router.get("/feed", getFeed);
router.post("/:postId/like", toggleLike);
router.post("/:postId/comment", addComment);

module.exports = router;
