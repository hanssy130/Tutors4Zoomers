const express = require("express");
const bodyParser = require("body-parser");



const app = express()



app.set ("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + "/public"));


// Landing Page
// ======================================


app.get("/", (req, res)=> {
    res.render("home")
});


// Login Page
// ======================================


app.get("/login", (req, res)=> {
    res.render("login")
});



let port = process.env.PORT;
if (port == null || port == ""){
    port = 3001;
}

app.listen(port, ()=> {
    console.log("Server has started ")
})