const { Router } = require("express");
const { getUser, loginUser, signUpUser, getSuggestions } = require("../controllers/user");
const { commentOnPost, createPost, deleteCommentOfPost, getPosts, likePost, viewPost } = require("../controllers/post");

const router = Router();

// root path
router.get("/", (req, res) => {
  res.status(200).send({ status: "OK", message: "App is running" });
});

/*************** USER APIs begins ********************/
router.get("/api/v1/user/:id", getUser);

// login api
router.post("/api/v1/login", loginUser);

router.post("/api/v1/user", signUpUser);

router.get("/api/v1/user/:id/suggestions", getSuggestions);
/*************** USER APIs ends ********************/

/*************** POST APIs begins ********************/

// read file and send content of file as response
router.get("/api/v1/posts", getPosts);

// create new record in db
router.post("/api/v1/post", createPost);

// like post
router.post("/api/v1/post/:id/like", likePost);

// view post
router.post("/api/v1/post/:id/view", viewPost);

// add post's comment
router.post("/api/v1/post/:id/comment", commentOnPost);

// add post's comment
router.delete("/api/v1/post/:id/comment/:cid", deleteCommentOfPost);

/*************** POST APIs ends ********************/

module.exports = {
  router,
};
