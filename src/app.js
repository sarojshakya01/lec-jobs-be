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

app.post("/api/v1/user", async (req, resp) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  const { username, email, fullname, title, job_type, skills, address, password } = req.body;

  const usernameUser = await User.findOne({ username });
  if (usernameUser) {
    return resp.status(400).send({ error: "Username already taken" });
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
      resp.status(200).send(createdUser);
    })
    .catch((err) => {
      console.error(err);
      resp.status(500).send({ error: "Can not process your reqest" });
    });
});
/*************** USER APIs begins ********************/

/*************** POST APIs begins ********************/

// read file and send content of file as response
app.get("/api/v1/posts", (req, res) => {
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});

/*************** POST APIs begins ********************/

app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
