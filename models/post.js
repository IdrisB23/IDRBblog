const mongoose = require("mongoose");

const dateSchema = require("./date.js");

module.exports = mongoose.Schema({
    linkToPost: {
        type: String,
        required: true
    },
    postTitle: {
        type: String,
        required: true
    },
    postSubTitle: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    postDate: {
        type: dateSchema,
        required: true
    },
    prevImgLink: {
        type: String,
        required: true
    }
});