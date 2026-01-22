const Post = require("../models/Post");
const User = require("../models/User");

// Create post
exports.createPost = async (req, res) => {
  try {
    const { userId, text, image } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.create({
      user: userId,
      text,
      image: image || "",
    });

    const populated = await Post.findById(post._id).populate("user", "username name avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get feed (pagination for infinite scroll)
exports.getFeed = async (req, res) => {
  try {
    const { userId, page = 1, limit = 5 } = req.query;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const feedUsers = [userId, ...user.following];

    const posts = await Post.find({ user: { $in: feedUsers } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar");

    const total = await Post.countDocuments({ user: { $in: feedUsers } });

    res.json({
      posts,
      page: Number(page),
      total,
      hasMore: Number(page) * Number(limit) < total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like / Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // const alreadyLiked = post.likes.includes(userId);
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);


    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updated = await Post.findById(postId)
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    const updated = await Post.findById(postId)
      .populate("user", "username name avatar")
      .populate("comments.user", "username name avatar");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
