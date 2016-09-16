// load the things we need
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
// POST Requests
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
//override using a query value
var connect        = require('connect')
var methodOverride = require('method-override')
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
// Adding MongoDB to the Application
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";
console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);


const PORT = 8080;
let data = require("./urls_database.js");


// Generate a Random shortUrl
function generateRandomString() {
  return newUrl = Math.random().toString(36).substring(3, 9);
}

// Main Page
app.get("/urls", (req, res) => {
  let urls = {
    urls: data
  };
  console.log(urls);
  res.render("urls_index", urls);
});

// Add new Url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const newKey = generateRandomString();
  console.log("POST /urls ", req.body.longUrl);
  data[newKey] = req.body.longUrl;
  res.redirect("/urls");
});

// Edit Method Override
app.get("/urls/:shortUrl", (req, res) => {
  let templateVars = {
    shortUrl: req.params.shortUrl,
    longUrl: data[req.params.shortUrl]
  };
  res.render("urls_show", templateVars);
});

app.put("/urls/:shortUrl", (req, res) => {
  data[req.params.shortUrl] = req.body.newLongUrl;
  res.redirect("/urls/");
});

// Redirect shortUrl
app.get("/:shortUrl", (req, res) => {
  let longUrl = data[req.params.shortUrl]
  res.redirect(longUrl);
});

// Delete Method Override
app.delete("/urls/:shortUrl", (req, res) => {
  delete data[req.params.shortUrl];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});