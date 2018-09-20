var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var axios = require("axios");

var PORT = 3000;

var app = express();

var databaseUrl = "articles";
var collections = ["Article"];

app.use(logger("dev"));
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/testing";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = require('./models');

app.get("/data", function(req, res) {
  axios.get(" ").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    res.redirect('/');
  });
});


app.get("/", function(req, res) {
   db.Article.find({"saved": false}, function(error, data) {
    var handlebarsContent = {
        article: data
      };

      console.log(handlebarsContent);

      res.render("index", handlebarsContent);
    });
  });

require("./routes/handlebarsRoutes")(app);
module.exports = app;

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

