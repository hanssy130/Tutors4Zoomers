const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose")


// Initialize Express
// =========================================


const app = express();


// Initalize view engine and body parser
// =========================================

app.set ("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + "/public"));


// Initialize Mongoose
// ========================================

const dbUsername = "gyang";
const dbPassword = "123123123";
mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0-p9khr.mongodb.net/T4Z`,
                { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

// Initialize Passport
// ==========================================

app.use(require("express-session")({
    secret: "Sign Up test for",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// Initialize Mongoose Schemas
// =========================================
const userDetail = new mongoose.Schema({
    firstName   : String,
    lastName    : String,
    email       : String,
    age         : String,
    education   : String,
    major       : String,
});

const userSchema = new mongoose.Schema({
    username    : String,
    password    : String,
    status      : String,
    detail      : userDetail
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
    res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/signin",
    failureRedirect: "/signup"
}), (req, res) => {
})

// Sign Up
// =====================================

app.get("/signup", (req, res) => {
    res.render("signup", {
        errorMessage: ""
    });
});

app.post("/signup", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({
        username : req.body.username,
        status : req.body.type,
        detail : {
            firstName : req.body.firstName,
            lastName  : req.body.lastName,
            age       : req.body.age,
            email     : req.body.email,
            education : req.body.education,
            major     : req.body.major
        }
        }
    
    ), req.body.password, (err, user) => {
        if(err){
            return res.render('signup', {
                errorMessage: "A user with the given username is already registered"
            });
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect("/signin")
        });
    }
    )
});


// feature page
// =======================================

app.get("/feature", (req, res) => {
    res.render("/feature")
});


app.post("/feature", (req, res) => {
    res.redirect("/feature")
});

// After user logged in
// ========================================

app.get("/signin", checkAuthenticated ,(req, res) => {
    res.render("signin")
});

// Logout 
// ========================================================

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/")
});


// Middleware to prevent user from visiting pages that need login
// ==============================================================

function checkAuthenticated (req, res, next) {
    message = ""
    if (req.isAuthenticated()){
        return next()
    }
    else{
    res.redirect("/signup")}
}


// port setup
// ==========================================

let port = 3001

app.listen(port, ()=> {
    console.log("Server has started ")
});