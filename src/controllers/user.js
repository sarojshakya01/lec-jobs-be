const { User } = require("../db/model");

const getUser = async (req, res) => {
  console.log("get user called");
  const users = await User.find({ id: 1 });
  res.status(200).send(users[0]);
};

const loginUser = async (req, res) => {
  console.log("logged in");
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
};

const signUpUser = async (req, res) => {
  console.log("sign up");
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  const {
    username,
    email,
    fullname,
    title,
    job_type,
    skills,
    address,
    password,
  } = req.body;

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
};

module.exports = {
  getUser,
  loginUser,
  signUpUser,
};
