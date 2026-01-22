require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("./models/User");
const Post = require("./models/Post");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding ✅");

    await User.deleteMany();
    await Post.deleteMany();

    // Create Users
    const users = [];
    for (let i = 0; i < 6; i++) {
      users.push({
        username: faker.internet.username().toLowerCase(),
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
      });
    }

    const createdUsers = await User.insertMany(users);

    // Follow relationships
    // user0 follows user1, user2, user3
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);
    createdUsers[3].followers.push(createdUsers[0]._id);

    await createdUsers[0].save();
    await createdUsers[1].save();
    await createdUsers[2].save();
    await createdUsers[3].save();

    // Create Posts
    const posts = [];
    for (let i = 0; i < 20; i++) {
      const randomUser = faker.helpers.arrayElement(createdUsers);

      posts.push({
        user: randomUser._id,
        text: faker.lorem.sentence(10),
        image: "", // we will add Cloudinary later
        likes: [],
        comments: [],
      });
    }

    await Post.insertMany(posts);

    console.log("Seed Data Inserted Successfully 🎉");
    process.exit();
  } catch (err) {
    console.log("Seed Error ❌", err);
    process.exit(1);
  }
}

seed();
