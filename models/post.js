const mongoose = require("mongoose");

const postDateSchema = require("./postDate.js");

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
    postDate: {
        type: postDateSchema,
        required: true
    },
    prevImgLink: {
        type: String,
        required: true
    }
});