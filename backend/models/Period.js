const mongoose = require("mongoose");
const periodSchema = new mongoose.Schema(
  {
    professor:{
        type:String,
        required:true,
    },
    groupNames:[String],
    room: {
      type: String,
      required: true,
    },
    bans: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const period = mongoose.model("Period", periodSchema);
module.exports = period;