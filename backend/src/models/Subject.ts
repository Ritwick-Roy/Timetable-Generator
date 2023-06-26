import mongoose from "mongoose";
import { ISubject } from "../types/Subject";

const subjectSchema = new mongoose.Schema<ISubject>(
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

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;