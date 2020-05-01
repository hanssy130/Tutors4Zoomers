const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./test-for-firestore-firebase-adminsdk-fvvlh-e6a9cc9aed.json")

// Initialize Express
// =========================================


const app = express();


// Initialize FireStore
// ========================================

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const db = admin.firestore();


// Initalize view engine and body parser
// =========================================

app.set ("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + "/public"));


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

// Sign Up
// =====================================

app.get("/signup", (req, res) => {
    res.render("signup");
});


// feature page
// =======================================

app.get("/feature", (req, res) => {
    db.collection('test').doc("george").get().then( doc => {
        if (!doc.exists){
            console.log("No doc")
            res.render("feature", {
            });
        }
        else{
            userData = doc.data()
            res.render("feature", {
                info: userData
            });
        }
    })
    .catch(err => {
        console.log(err)
    })

});


app.post("/feature", (req, res) => {
    title = req.body.title
    data = {
        title: req.body.title,
        body: req.body.info
    };
    db.collection("test").doc(title).set(data, {merge: true});
    res.redirect('feature');
});











// port setup
// ==========================================

let port = 3001

app.listen(port, ()=> {
    console.log("Server has started ")
})