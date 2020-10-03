const mongoose = require("mongoose");

module.exports = mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    year:  {
        type: Number,
        required: true
    }
});