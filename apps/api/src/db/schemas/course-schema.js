const mongoose = require("mongoose");

const questionSchema = require("./question-schema");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 256,
    },
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Question",
        default: [],
    },
  },
  { timestamps: true }
);

module.exports = courseSchema;
