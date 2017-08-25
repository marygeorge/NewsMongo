
// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
app.use(express.static("public"));

// GOK if this works
const delay = require('delay');

//handlebars
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "index" }));
// app.set("view engine", "handlebars");

// Database configuration
//var databaseUrl = "NewsScraper";
//var collections = ["scrapedNews"];

// Hook mongoose configuration to the db variable
// var db = mongojs(databaseUrl, collections);
mongoose.connect('mongodb://localhost/NewsScraper');
var db=mongoose.connection;
db.on("error", function(error) {
  console.log("Database Error:", error);
});
var newsSchema = mongoose.Schema({
    Title: String,
    Link: String
    });
db.once('open', function() {
    console.log("Connected!!");
    
});
var Story = mongoose.model('NYTimesNews', newsSchema);
var savedStory = mongoose.model('NYTimesNewsSaved', newsSchema);
    
// app.get("/scrapeShow", function(req, res){
    
// });

app.get("/scrape", function(req, res){

      
    //get news from NYTimes
    request("https://www.nytimes.com/?WT.z_jog=1&hF=f&vS=undefined", function(error, response, html) {

        var $ = cheerio.load(html);
        $("h2.story-heading").each(function(i, element) {

            var title = $(element).text();
            var link = $(element).children().attr("href");
            // save each story to database
            var news = new Story({ 
                Title: title,
                Link: link 
                });
            news.save(function (err, news) {
                if (err) return console.error(err);
            });

            //storing it in results to send it back to client
            // results.push({
            //     title: title,
            //     link: link });
        });
        console.log("Scrape done");
        //res.send(results);

        delay(500)
    .then(() => {
        Story.find(function (err, stories) {
            if (err) return console.error(err);
            console.log("ScrapeShow"+stories);
            res.send(stories);
        });
    });
 
        
    });
    
});

app.get("/getSaved", function(req, res){
    savedStory.find(function (err, stories) {
            if (err) return console.error(err);
            console.log("ScrapeShow"+stories);
            res.send(stories);
        });
});


app.post("/storySave/:id", function(req, res){

    console.log(req.params.id);
    Story.find({_id:req.params.id},function (err, stories) {
            if (err) return console.error(err);
            console.log("save"+stories);
           // console.log("save title "+stories[0].Title);
            var newsavedStory= new savedStory({
                Title:stories[0].Title,
                Link:stories[0].Link
            });
            console.log("newsavedStory"+newsavedStory);
            newsavedStory.save(function (err, newsavedStory) {
                if (err) return console.error(err);
            });
            //res.send(stories);
    });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
