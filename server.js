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

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// app.use(logger("dev"));
//make public directory
app.use(express.static(__dirname + '/public'));
app.use(express.static('/images'));
//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// connect to mongo db
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//routes

app.get("/", (req, res) => {
    db.Job.find({})
        .then(dbJobs => { res.render("index", { jobs: dbJobs }); console.log(dbJobs) })
        .catch(err => res.json(err));
})

//GET route for scraping indeed software developer jobs in ontario
app.get("/scrape", (req, res) => {
    console.log("scraping")
    //grab the body of the html with axios
    axios.get("https://ca.indeed.com/jobs?q=software+developer&l=Toronto%2C+ON").then(function (response) {
        //load into cheerio
        const $ = cheerio.load(response.data);

        //
        $("div.jobsearch-SerpJobCard").each(function (i, element) {
            let result = {};
            result.title = $(element).find("a").attr("title");
            result.link = "https://ca.indeed.com" + $(element).find("a").attr("href");
            result.company = $(element).find("span.company").text().trim();
            result.summary = $(element).find("li").text();

            // Create a new Job using the `result` object built from scraping
            db.Job.create(result)
                .then(dbJob => res.status(200))
                .catch(err => console.log(err));

        });

        res.send("Scrape Complete");
    });
});




//get all jobs from the db
app.get("/jobs", (req, res) => {
    db.Job.find({})
        .then(dbJob => res.json(dbJob))
        .catch(err => res.json(err));
});

//get jobs by id, populate it with note
app.get("/jobs/:id", (req, res) => {
    db.Job.findOne({ _id: req.params.id })
        // populate all of the notes associated with it
        .populate("note")
        //if we are able to find a job then send back to client
        .then((dbJob) => res.json(dbJob))
        .catch(err => res.json(err));
});

// route for saving and updating a jobs associated note
app.post("/jobs/:id", (req, res) => {
    //create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(dbNote => db.Job.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true }))
        .then(dbJob => res.json(dbJob))
        .catch(err => res.json(err));
});

//save job
app.get("/save/:id", (req, res) => {
    console.log("saved " + req.params.id)
    db.Job.updateOne({ _id: req.params.id }, { $set: { saved: true } })
        .then(() => M.toast({ html: 'Saved' }))
        .catch(err => res.json(err));
});

//delete saved job
app.get("/delete-saved/:id", (req, res) => {
    console.log("delete " + req.params.id)
    db.Job.updateOne({ _id: req.params.id }, { $set: { saved: false } })
        .then(savedJob => console.log(savedJob))
        .catch(err => res.json(err));
});

//delete note
app.get("/delete-note/:id", (req, res) => {
    console.log("delete " + req.params.id)
    db.Note.remove({ _id: req.params.id }, { $set: { saved: false } })
        .then(savedJob => console.log(savedJob))
        .catch(err => res.json(err));
});

// get all saved jobs
app.get("/saved", (req, res) => {
    db.Job.find({ saved: true })
        .then(savedJobs => res.render("saved", { jobs: savedJobs }))
        .catch(err => res.json(err))
});

// delete all jobs
app.get("/delete-all", (req, res) => {
    db.Job.deleteMany({})
        .then(console.log("deleted"))
        .catch(err => res.json(err));
});

//Start the server
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));