import { Document } from "mongoose";
import { IPeriod } from "./Period";

export interface ISubject extends Document {
  subjectName: string;
  labPeriods: IPeriod[];
  lectPeriods: IPeriod[];
  tutPeriods: IPeriod[];
  createdAt: Date;
  updatedAt: Date;
}
