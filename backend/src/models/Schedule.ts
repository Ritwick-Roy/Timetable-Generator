import mongoose from "mongoose";
import { ISchedule } from "../types/Schedule";

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }],
  },
  { timestamps: true }
);

const Schedule: mongoose.Model<ISchedule> = mongoose.model<ISchedule>("Schedule", scheduleSchema);

export default Schedule;