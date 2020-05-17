// Setup
// =========================================
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const methodOverride = require("method-override");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

// Initialize Express
// =========================================
const app = express();
const server = require("http").Server(app);

// Initialize port
// ==========================================
const port = process.env.PORT || 3001;
console.log(port);
server.listen(port, "0.0.0.0", () => {
  console.log("Server has started ");
});

const socket = require("socket.io");
const io = socket.listen(server);
io.sockets.on("connection", newConnection);

// Initalize view engine and body parser
// =========================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Initialize Mongoose
// =========================================
const dbUsername = "gyang";
const dbPassword = "123123123";
mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-p9khr.mongodb.net/T4Z`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

// Initialize Passport
// ==========================================
app.use(
  require("express-session")({
    secret: "Sign Up test for",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize Mongoose Schemas
// =========================================
const userDetail = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: String,
  education: String,
  major: String,
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  status: String,
  detail: userDetail,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Landing Page
// ======================================
app.get("/", (req, res) => {
  res.render("home");
});

// Login Page
// ======================================
app.get("/login", (req, res) => {
  res.render("login", {
    errorMessage: "",
  });
});

app.get("/faillogin", (req, res) => {
  res.render("login", {
    errorMessage: "Invalid username or password",
  });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/signin",
    failureRedirect: "/faillogin",
  }),
  (req, res) => {}
);

// Sign Up
// =====================================
app.get("/signup", (req, res) => {
  res.render("signup", {
    errorMessage: "",
  });
});
app.post("/signup", (req, res) => {
  req.body.username;
  req.body.password;
  User.register(
    new User({
      username: req.body.username,
      status: req.body.type,
      detail: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        education: req.body.education,
        major: req.body.major,
      },
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.render("signup", {
          errorMessage: "A user with the given username is already registered",
        });
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/signin");
      });
    }
  );
});

// Tutoring Sessions
// ========================================
app.get("/session/:sessionID/", (req, res) => {
  let sessionID = req.params.sessionID;
  res.render("session");
});

// After user logged in
// ========================================
app.get("/signin", checkAuthenticated, (req, res) => {
  res.render("signin");
});

app.get("/userprofile", checkAuthenticated, (req, res) => {
  userID = req.user;
  res.render("userprofile", { user: userID });
});

app.put("/userprofileUpdate", checkAuthenticated, (req, res) => {
  userID = req.user._id;

  User.findByIdAndUpdate(
    userID,
    { status: req.body.type, detail: req.body.detail },
    (err, updatedUser) => {
      if (err) {
        res.send("failed");
      } else {
        res.redirect("/userprofile");
      }
    }
  );
});

app.delete("/destoryprofile", checkAuthenticated, (req, res) => {
  User.findByIdAndDelete(req.user._id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// Logout
// =========================================
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware to prevent user from visiting pages that need login
// ==========================================
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("login", {
      errorMessage: "Invalid Username and Password",
    });
  }
}

// Socket
// ==========================================
function newConnection(socket) {
  console.log("New connection: " + socket.id);
  socket.on("mouse", mouseMsg);
  socket.on("line", lineMsg);
  socket.on("colour", colourUpdate);
  socket.on("clear", clearCanvas);
  socket.on("lineLengths", updateLinesLength);
  socket.on("lineArray", updateLineArray);
  socket.on("delete", tester);
  socket.on("weight", updateWeight);
  function tester() {
    socket.broadcast.emit("delete");
  }
  function updateLinesLength(data) {
    // send data back out to others
    socket.broadcast.emit("lineLengths", data);
  }
  function updateLineArray(data) {
    // send data back out to others
    socket.broadcast.emit("lineArray", data);
  }
  function mouseMsg(data) {
    // send data back out to others
    socket.broadcast.emit("mouse", data);
    console.log(data);
  }
  function lineMsg(data) {
    // send data back out to others
    socket.broadcast.emit("line", data);
  }
  function colourUpdate(data) {
    // send data back out to others
    socket.broadcast.emit("colour", data);
  }
  function clearCanvas(data) {
    // send data back out to others
    socket.broadcast.emit("clear", data);
  }
  function updateWeight(data) {
    // send data back out to others
    socket.broadcast.emit("weight", data);
  }
}
