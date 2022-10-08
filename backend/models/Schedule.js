const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    beforeBreak: {
      type: Number,
      required: true,
    },
    afterBreak: {
      type: Number,
      required: true,
    },
    subjects: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    }],
  },
  { timestamps: true }
);

const schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = schedule;