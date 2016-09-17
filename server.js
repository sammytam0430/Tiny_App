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

var db;

MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) return console.log(err);
  db = database;
  // let collection = database.collection("urls");
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
});

let data = require("./urls_database.js");


// Generate a Random shortUrl
function generateRandomString() {
  return newUrl = Math.random().toString(36).substring(3, 9);
}

// Main Page
app.get('/urls', (req, res) => {
  db.collection('urls').find().toArray( (err, results) => {
    console.log(results);
    res.render('urls_index', {urls: results});
  });
});

// Add new Url
app.get("/", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const newKey = generateRandomString();
  console.log("POST /urls ", req.body.longUrl);
  db.collection('urls').insertOne({'shortUrl': newKey, 'longUrl': req.body.longUrl},  (err, result) => {
    res.redirect("/urls");
  });
});

// Edit Method Override
app.get("/urls/:id", (req, res) => {
  var shortUrl = req.params.id;
  db.collection('urls').findOne({'shortUrl': shortUrl}, (err, result) => {
   res.render('urls_show', {urls: result});
   console.log(result)
   });
});

app.put("/urls/:id", (req, res) => {
  var shortUrl = req.params.id;
  db.collection('urls').updateOne({'shortUrl': shortUrl}, { $set: {'longUrl': req.body.newLongUrl}}, (err, result) => {
  res.redirect("/urls/");
  });
});

// Redirect shortUrl
app.get("/u/:shortUrl", (req, res) => {
  var shortUrl = req.params.shortUrl;
  db.collection('urls').findOne({'shortUrl': shortUrl}, (err, result) => {
  console.log(result)
  res.redirect(result.longUrl);
  });
});

// Delete Method Override
app.delete("/urls/:id", (req, res) => {
  var shortUrl = req.params.id;
  db.collection('urls').deleteOne({'shortUrl': shortUrl}, (err, result) => {
  res.redirect("/urls");
  });
});
