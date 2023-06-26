import { Request, Response } from "express";
import axios from 'axios';
import Schedule from "../models/Schedule";
import { ISchedule } from '../types/Schedule';
import Period from "../models/Period";
import { IPeriod } from '../types/Period';
import { ISubject } from '../types/Subject';

export const generateTimetable = async (req: Request, res: Response) => {
  try {
    const scheduleId: string = req.params.scheduleId;
    const schedule: ISchedule = await Schedule.findById(scheduleId).populate("subjects") as ISchedule;

    let input: string = `${schedule.days} ${schedule.beforeBreak} ${schedule.afterBreak} ${schedule.subjects.length} `;

    for (const subject of schedule.subjects) {
      const currSubject = subject as ISubject;
      input += `${currSubject.subjectName} ${currSubject.lectPeriods.length} `;

      for (const periodId of currSubject.lectPeriods) {
        const currPeriod = await Period.findById(periodId) as IPeriod;
        input += `${currPeriod.professor} ${currPeriod.groupNames.length} `;
        
        for (const groupName of currPeriod.groupNames) {
          input += `${groupName} `;
        }

        input += `${currPeriod.room} ${currPeriod.bans} `;
      }

      input += `${currSubject.labPeriods.length} `;

      for (const periodId of currSubject.labPeriods) {
        const currPeriod = await Period.findById(periodId) as IPeriod;
        input += `${currPeriod.professor} ${currPeriod.groupNames.length} `;

        for (const groupName of currPeriod.groupNames) {
          input += `${groupName} `;
        }

        input += `${currPeriod.room} ${currPeriod.bans} `;
      }

      input += `${currSubject.tutPeriods.length} `;

      for (const periodId of currSubject.tutPeriods) {
        const currPeriod = await Period.findById(periodId) as IPeriod;
        input += `${currPeriod.professor} ${currPeriod.groupNames.length} `;

        for (const groupName of currPeriod.groupNames) {
          input += `${groupName} `;
        }

        input += `${currPeriod.room} ${currPeriod.bans} `;
      }
    }

    const result = await axios.post('http://localhost:8000', { input }, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(result.data);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};