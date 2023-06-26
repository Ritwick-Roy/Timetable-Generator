import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import { ISchedule } from "../types/Schedule";
import Period from "../models/Period";
import Subject from "../models/Subject";
import { ISubject } from "../types/Subject"

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules: ISchedule[] = await Schedule.find().populate({ path: 'subjects', populate: { path: 'lectPeriods labPeriods tutPeriods' } });
    res.json(schedules);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const addSchedule = async (req: Request, res: Response) => {
  try {
    const { name, days, beforeBreak, afterBreak, subjects } = req.body;
    const schedule = new Schedule({
      name,
      days,
      beforeBreak,
      afterBreak,
      subjects
    });
    const result: ISchedule = await schedule.save();
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { updatedSchedule } = req.body;
    const result: ISchedule | null = await Schedule.findByIdAndUpdate(req.params.id, updatedSchedule).populate({ path: 'subjects', populate: { path: 'lectPeriods labPeriods tutPeriods' } });
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const schedule: ISchedule | null = await Schedule.findById(req.params.id).populate({ path: 'subjects', populate: { path: 'lectPeriods labPeriods tutPeriods' } });
    if (!schedule) {
      return res.status(400).json({ msg: "schedule not found" });
    }
    res.json(schedule);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {

    const schedule: ISchedule | null = await Schedule.findById(req.params.id).populate({ path: 'subjects', populate: { path: 'lectPeriods labPeriods tutPeriods' } });
    
    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    const subjectIds: string[] = schedule.subjects.map((subject: ISubject) => subject._id);

    await Period.deleteMany({ subject: { $in: subjectIds } });
    await Subject.deleteMany({ _id: { $in: subjectIds } });
    
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!deletedSchedule) {
      return res.status(400).json({ msg: 'Could not delete' });
    }

    res.json({ msg: 'Schedule deleted successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

