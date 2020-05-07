// Uses Heroku's port or local port 5000.
var PORT = process.env.PORT || 5000;

const express = require("express");

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("pages/index"));

// app.get("/login", (req, res) => res.render("pages/login"));

// app.get("/signup", (req, res) => res.render("pages/signup"));

app.listen(PORT);
