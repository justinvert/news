var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var axios = require("axios");
var Note = require("./models/Note.js");
var methodOverride = require('method-override');



var PORT = 3000;

var app = express();

var databaseUrl = "articles";
var collections = ["Article"];

app.use(logger("dev"));
app.use(express.static("public"));

// app.use(methodOverride('_method'));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/test";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = require('./models');
app.get("/data", function(req, res) {
  
    request(" ", function(error, response, html) {
      
        var $ = cheerio.load(html);
    
      //   $(".page-title").each(function(i, element) {
          $(".info-wrapper").each(function(i, element) {
          var title = $(element).children("strong").text();
          var link = $(element).children().children("a").attr("href");
          var text = $(element).children(".details").children(".excerpt").text();
          // var text = $(element).children().children().children().attr("srcset");
  
        var result = {
          title: title,
          link: link,
          text: text,
          saved: false

        }
        
        console.log(result);
        
        db.Article.findOne({title:title}).then(function(data) {
          
          console.log(data);
  
          if(data === null) {
  
            db.Article.create(result).then(function(article) {
              res.json(article);
            });
          }
        }).catch(function(err) {
            res.json(err);
        });
  
      });
      res.redirect('/');
    });
  });

// app.get("/data", function(req, res) {
//   axios.get(" ").then(function(response) {
//     var $ = cheerio.load(response.data);

//     $("article h2").each(function(i, element) {
//       var result = {};

//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//       db.Article.create(result)
//         .then(function(dbArticle) {
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           return res.json(err);
//         });
//     });

//     res.redirect('/');
//   });
// });


app.post("/articles/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
    
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect('/');
      }
    });
});

app.post("/articles/delete/:id", function(req, res) {
    db.Article.findOneAndRemove({ "_id": req.params.id }, { "saved": false})
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      }
      else {
             res.redirect('/saved');
      }
  
    });
});


app.post("/note/save/:id", function(req, res) {
  var createNote = new Note(req.body);
 createNote.save(function (error, doc) {
        if (error) {
     res.send(error);
        }
        else {
            // db.Note.findOneAndUpdate({
            db.Article.findOneAndUpdate({
                "_id": req.params.id
            }, {
                $push: {
                "note": doc._id
                }
            }, {
                new: true
            }, function (err, doc) {
                if (err) {
                    res.send(err);
                }
                else {
          res.redirect('/saved');
                }
            }); }
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

  app.get("/saved", function(req, res) {
    db.Article.find({"saved": true}, function(error, data) {
     var handlebarsContent = {
         article: data
       };
 
       console.log(handlebarsContent);
 
       res.render("saved", handlebarsContent);
     });
   });

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
   

require("./routes/handlebarsRoutes")(app);
module.exports = app;

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

