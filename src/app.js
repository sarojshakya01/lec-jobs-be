const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 5001; // api port

const mongoDbURI = "mongodb://localhost:27017/lec"; // db connection string

mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: { type: String, unique: true },
  password: String,
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

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  job_type: String,
  pay_rate_per_hr_dollar: Number,
  skills: [{ type: String }],
  liked_by: [{ type: String }],
  viewed_by: [{ type: String }],
  id: { type: Number, unique: true },
  user_id: Number,
  post_by_username: String,
  post_by_fullname: String,
  post_date: { type: Date, default: new Date() },
  comments: [{ type: Object }],
});

// http://localhost:5000 or http://localhost:5000/
app.get("/", (req, res) => {
  res.status(200).send({ status: "OK", message: "App is running" });
});

/*************** USER APIs begins ********************/
const User = mongoose.model("user", userSchema);

app.get("/api/v1/user", async (req, res) => {
  // const user = fs.readFileSync("./data/user.json", "utf-8").toString();
  const users = await User.find({ id: 1 });
  res.status(200).send(users[0]);
});

// login api
app.post("/api/v1/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
    is_active: true,
  });
  if (user) {
    res.status(200).send({ message: "Login successfull", data: user });
  } else {
    res.status(400).send({ error: "Invalid username or password" });
  }
});

app.post("/api/v1/user", async (req, res) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  const { username, email, fullname, title, job_type, skills, address, password } = req.body;

  const usernameUser = await User.findOne({ username });
  if (usernameUser) {
    return res.status(400).send({ error: "Username already taken" });
  }

  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser = {
    email: email,
    password,
    username,
    fullname,
    title,
    skills,
    address,
    job_type,
    id,
    is_active: true,
    followers: [],
    followings: [],
  };
  User.create(newUser)
    .then((createdUser) => {
      console.log("User created");
      res.status(200).send(createdUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Can not process your request" });
    });
});
/*************** USER APIs begins ********************/

/*************** POST APIs begins ********************/

const Post = mongoose.model("post", postSchema);

// read file and send content of file as response
app.get("/api/v1/posts", async (req, res) => {
  const posts = await Post.find({});
  res.status(200).send(posts);
});

// create new record in db
app.post("/api/v1/post", async (req, res) => {
  const lastPost = await Post.findOne({}, null, { sort: { id: -1 } });

  const { title, description, location, job_type, pay_rate_per_hr_dollar, skills, user_id, post_by_username, post_by_fullname } = req.body;

  let id = 1;
  if (lastPost) {
    id = lastPost.id + 1;
  }
  const newPost = {
    title,
    description,
    location,
    job_type,
    pay_rate_per_hr_dollar,
    skills,
    liked_by: [],
    viewed_by: [],
    id,
    user_id,
    post_by_username,
    post_by_fullname,
    post_date: new Date(),
    comments: [],
  };
  Post.create(newPost)
    .then((createdPost) => {
      console.log("Post created");
      res.status(200).send(createdPost);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Can not process your request" });
    });
});

/*************** POST APIs begins ********************/

app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
