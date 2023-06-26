import { Document} from "mongoose";

export interface IPeriod extends Document {
  professor: string;
  groupNames: string[];
  room: string;
  bans: string;
  createdAt: Date;
  updatedAt: Date;
}