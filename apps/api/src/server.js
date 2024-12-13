const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const logRequests = require("./middleware-logRequests"); 
const corsHeaders = require("./middleware-corsHeaders"); 

const app = express();
const port = 3000;

const courseRouter = require("./routers/course-router");
const questionRouter = require("./routers/question-router");
const defaultRouter = require("./routers/default-router");

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logging Middleware
app.use(logRequests);

// CORS Headers Middleware
app.use(corsHeaders);

// API Routers
app.use(courseRouter);
app.use(questionRouter);
app.use(defaultRouter);

// Database Connection and Server Startup
mongoose
  .connect("mongodb://admin:password@127.0.0.1:27042/course-catalog", {
    authSource: "admin",
  })
  .then(() => {
    console.log("MongoDB started!");

    app.listen(port, () => {
      console.log(`API running on port ${port} ...`);
    });
  })
  .catch((error) => console.log(error));
