const express = require("express");

//morgan for logging requests
const logger = require("morgan");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//make public directory
app.use(express.static("public"));

// connect to mongo db *****create db
mongoose.connect("mongodb://localhost/populatedb", { userNewUrlParser: true });

