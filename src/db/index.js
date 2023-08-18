const mongoose = require("mongoose");

const mongoDbURI = "mongodb://localhost:27017/lec"; // db connection string

const connectDB = () => {
  mongoose.connect(mongoDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
    connectDB
}