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

// booking
// =========================================

app.get("/booking", (req, res) => {
  User.find({}, (err, allData) => {
    if (err) {
      console.log(err)
    } else {
      res.render("booking", {allData : allData})
    }
  })
  
})

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

// Rooms
// =============================================
// list of rooms
const rooms = {};

app.get("/session", (req, res) => {
  console.log(rooms);
  res.render("sessionlist", { rooms: rooms });
});

app.post("/session/room", (req, res) => {
  console.log("added room");
  // if room exists return to room list
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }
  // add new room
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  console.log("redirected");
  // send message that new room was made
  io.emit("room-created", req.body.room);
});

app.get("/session/:room", (req, res) => {
  // if rooms doesn't exist return to room list
  if (rooms[req.params.room] == null) {
    return res.redirect("/session");
  }
  console.log(req.params.room);
  res.render("session", { roomName: req.params.room });
});

// Socket
// ==========================================
io.on("connection", (socket) => {
  console.log("new connection: " + socket.id);

  socket.on("mouse", mouseMsg);
  socket.on("line", lineMsg);
  socket.on("colour", colourUpdate);
  socket.on("clear", clearCanvas);
  socket.on("lineLengths", updateLinesLength);
  socket.on("lineArray", updateLineArray);
  socket.on("delete", tester);
  socket.on("weight", updateWeight);

  socket.on("new-user", (room) => {
    // joins the user to the room
    socket.join(room);
  });

  function tester(room, data) {
    // send to specific room
    socket.to(room).broadcast.emit("delete", data);
  }

  function updateLinesLength(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("lineLengths", data);
  }

  function updateLineArray(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("lineArray", data);
  }

  function mouseMsg(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("mouse", data);
    console.log(data);
  }

  function lineMsg(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("line", data);
  }

  function colourUpdate(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("colour", data);
  }

  function clearCanvas(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("clear", data);
  }

  function updateWeight(room, data) {
    // send data back out to others
    // send to specific room
    socket.to(room).broadcast.emit("weight", data);
  }
});
