var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var loggerFile = require("./middlewares/logger");
// var logger = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

require("./models");

var indexRouter = require("./routes/index");
var legacyTaskRouter = require("./routes/legacytask");
var taskRouter = require("./routes/task");
var authRouter = require("./routes/auth");

var app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.on("finish", () => {
    loggerFile(req, res);
  });
  next();
});

app.use("/", indexRouter);
app.use("/legacytasks", legacyTaskRouter);
app.use("/tasks", taskRouter);
app.use("/auth", authRouter);
module.exports = app;
