const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobSchema = new Schema({


    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    saved: {
        type: Boolean
    },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;