var db = require('../models');
var axios = require('axios');
var cheerio = require('cheerio');
let express = require('express');
let app = express();

app.get("/scrape", function(req, res) {
    axios.get("https://www.pokernews.com/news/").then(function(response) {
  
      var $ = cheerio.load(response.data);
  
  
      $("a.title").each(function(i, element) {
        // Save an empty result object
        var result = {};
        result.title = $(this)
          .text();
        result.link = "https://www.pokernews.com"+ $(this)
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
  
    db.Article.find({})
    .then(function(Articles) {
        res.render('articles', 
        {data: Articles})
     
    //   res.json(dbArticle);
    })
    .catch(function(err) {
  
      res.json(err);
    });
  });

  app.get('/', function(req, res){
    res.render("index");
});

  
  app.post("/articles/:id", function(req, res) {
      // Create a new Note in the db
      db.Comment.create(req.body)
        .then(function(dbComment) {
  
          return db.Article.findOneAndUpdate({}, { $push: { comment: dbComment._id } }, { new: true });
        })
        .then(function(dbArticle) {
  
          res.json(dbArticle);
        })
        .catch(function(err) {
  
          res.json(err);
        });
    });

    module.exports = app;