const express = require("express");

//scraping tools 
const axios = require("axios");
const cheerio = require("cheerio");

//morgan for logging requests
// const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;

// require models
const db = require("./models");

//initialize express
const app = express();

// app.use(logger("dev"));

//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//make public directory
app.use(express.static("public"));

// connect to mongo db
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

//routes

//GET rout for scraping wikiart.org
app.get("/scrape", (req, res) => {
    console.log("scraping")
    //grab the body of the html with axios
    axios.get("https://ca.indeed.com/jobs?q=software+developer&l=Toronto%2C+ON").then(function (response) {
        //load into cheerio
        const $ = cheerio.load(response.data);
        const result = [];
        //
        $("div.jobsearch-SerpJobCard").each(function (i, element) {

            var title = $(element).find("a").attr("title");
            var link = $(element).find("a").attr("href");
            var company = $(element).find("span.company").text().trim();
            var summary = $(element).find("li").text();

            // Save these results in an object that we'll push into the results array we defined earlier
            result.push({
                title,
                link: "https://ca.indeed.com" + link,
                company,
                summary

            });
        });
        console.log(result);
        res.json(result);
    });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

