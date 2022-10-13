// ENV file
require("dotenv").config();

// Error Handler
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");

//Middleware Imports
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const corsOptions = require()

const app = express();
app.use(morgan("dev"));

// connectDB()

app.use(cors());

app.use(express.json());
app.use(cookieParser());

// API / PAGE NOT FOUND
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
