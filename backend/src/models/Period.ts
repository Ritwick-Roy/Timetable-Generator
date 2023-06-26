import mongoose from "mongoose";
import { IPeriod } from "../types/Period";

const periodSchema = new mongoose.Schema<IPeriod>(
  {
    professor: {
      type: String,
      required: true,
    },
    groupNames: [String],
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

const Period = mongoose.model<IPeriod>("Period", periodSchema);
export default Period;