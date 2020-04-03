const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === "test") {
  mongoose.connect("", {
    useNewUrlParser: true
  });
} else {
  mongoose.connect("", {
    useNewUrlParser: true
  });
}

const app = express();

app.use(helmet());

app.use(cookieParser());
app.use(cors());

app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
