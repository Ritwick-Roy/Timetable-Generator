import { ISubject } from "../types/Subject";

export interface ISchedule {
  name: string;
  days: number;
  beforeBreak: number;
  afterBreak: number;
  subjects: ISubject[];
  createdAt: Date;
  updatedAt: Date;
}