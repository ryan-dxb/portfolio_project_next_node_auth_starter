// ENV file
require("dotenv").config();

// Error Handler
require("express-async-errors");
const errorHandler = require("./middleware/errorHandler");

const express = require("express");
const path = require("path");
const morgan = require("morgan");

//Middleware Imports
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/cors/corsOptions");

const connectDB = require("./config/connectDB");

const app = express();
app.use(morgan("dev"));

connectDB();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

app.use("/api/auth", require("./routes/authRoutes"));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
