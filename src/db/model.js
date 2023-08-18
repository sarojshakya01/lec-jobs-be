const mongoose = require("mongoose");

const { postSchema, userSchema } = require("./schema");

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);

module.exports = {
  User,
  Post,
};
