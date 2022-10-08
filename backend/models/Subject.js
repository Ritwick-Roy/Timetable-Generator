const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    labPeriods: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Period" 
    }],
    lectPeriods: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Period" 
    }],
    tutPeriods: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Period" 
    }],
  },
  { timestamps: true }
);

const subject = mongoose.model("Subject", subjectSchema);
module.exports = subject;