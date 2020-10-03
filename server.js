const port = 3000;
// imports
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//const slugify = require("sulgify");
const postSchema = require("./models/post.js");
const Post = mongoose.model("Post", postSchema);

const app = express();

// Listen on port
app.listen(port, () => console.log(`Listening on port ${port}`));


mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Static files
app.use("/", express.static(__dirname + "/public"));
app.use("/posts", express.static(__dirname + "/public"));


app.set("view engine", "ejs");

// Routes
app.get("/", paginatedResults(Post), (req, res) => {
    res.render("index", res.paginatedResults);
});

app.get("/pagination", paginatedResults(Post), (req, res) => {
    res.send(res.paginatedResults);
});

addRoutesToPosts(Post);

async function addRoutesToPosts(model) {
    var result = await model.find().exec();
    result.forEach((post) => {
        app.get(`/posts${post.linkToPost}`, (req, res) => {
            res.sendFile(__dirname + `/static pages/posts${post.linkToPost}.html`);
        })
    });
}

// middleware function
function paginatedResults(model) {
    return async (req, res, next) => {
        const results = {};
        let page = 1, limit = 3, pagDisplayButtonCount = 5;
        if (req.query.page)
            page = parseInt(req.query.page);
        if (req.query.limit)
            limit = parseInt(req.query.limit);
        // read the database in reverse order: newly added documents first
        const size = await model.countDocuments().exec();
        let pages = Math.ceil(size / limit);
        if (page > pages)
            page = pages;
        if (page < 1)
            page = 1;
        const skipped = size - page * limit;
        let startIndex = skipped;
        let endIndex = limit;


        let leftmostPage = page - Math.floor(pagDisplayButtonCount / 2);
        let rightmostPage = page + Math.floor(pagDisplayButtonCount / 2);

        if (rightmostPage > pages) {
            rightmostPage = pages;
            leftmostPage = pages - (pagDisplayButtonCount - 1);
        }

        if (leftmostPage < 1) {
            leftmostPage = 1;
            rightmostPage = pagDisplayButtonCount;
            if (rightmostPage > pages) {
                rightmostPage = pages;
            }
        }

        results.limit = limit;
        results.size = size;
        results.page = page;
        results.rightmostPage = rightmostPage;
        results.leftmostPage = leftmostPage;

        if (skipped < 0) {
            startIndex = 0;
            endIndex = limit + skipped;
        }
        try {
            // This returns an array containing JSON objects from the database
            const arr = await model.find().limit(endIndex).skip(startIndex).exec();
            results.results = arr.reverse();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
}

// About route: serves back static about page
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/static pages/about.html");
})

// Last route: gets updated maually each time a new post is added
app.get("/posts/last", (req, res) => {
    res.redirect("/posts/stacksQueues");
});