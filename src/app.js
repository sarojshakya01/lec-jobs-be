const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();

app.use(cors());

const PORT = 5001;
// connection string
const mongoDbURI = "mongodb://localhost:27017/lec";
mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  fullname: String,
  title: String,
  skills: [{ type: String }],
  address: String,
  job_type: String,
  id: Number,
  is_active: Boolean,
  followers: [{ type: String }],
  followings: [{ type: String }],
});

const User = mongoose.model("user", userSchema);

// User.createCollection()
//   .then((col) => {
//     console.log("Collection", "created");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// http://localhost:5000 or http://localhost:5000/
app.get("/", (req, res) => {
  res.status(200).send({ status: "OK", message: "App is running" });
});

// read file and send content of file as response
app.get("/api/v1/posts", (req, res) => {
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});

app.get("/api/v1/user", async (req, res) => {
  // const user = fs.readFileSync("./data/user.json", "utf-8").toString();
  const user = await User.find({ id: 1 });
  res.status(200).send(user[0]);
});

app.post("/api/v1/user", async (req, resp) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser = {
    email: "test@test.com",
    username: "saroj",
    fullname: "Test User",
    title: "Software Developer",
    skills: ["JS", "PHP", "JAVA"],
    address: "Kathmnadu, Nepal",
    job_type: "Full Time",
    id: id,
    is_active: true,
    followers: [],
    followings: [],
  };
  User.create(newUser).then((createdUser) => {
    console.log("User created");
    resp.status(200).send(createdUser);
  });
});

app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
