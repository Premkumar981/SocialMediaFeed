const User = require("../models/User");

// Create user (testing purpose)
exports.createUser = async (req, res) => {
  try {
    const { username, name, avatar } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({ username, name, avatar });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username name avatar followers following");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Follow user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { targetId } = req.params;

    if (userId === targetId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) return res.status(404).json({ message: "User not found" });

    if (user.following.includes(targetId)) {
      return res.status(400).json({ message: "Already following" });
    }

    user.following.push(targetId);
    target.followers.push(userId);

    await user.save();
    await target.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { targetId } = req.params;

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== userId);

    await user.save();
    await target.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
