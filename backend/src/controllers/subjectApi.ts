import { Request, Response } from 'express';
import Subject from '../models/Subject';
import { ISubject } from '../types/Subject';
import Period from '../models/Period';
import Schedule from '../models/Schedule';

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects: ISubject[] = await Subject.find().populate('labPeriods').populate('tutPeriods').populate('lectPeriods');
    res.json(subjects);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const addSubject = async (req: Request, res: Response) => {
  try {
    const { subjectName, labPeriods, tutPeriods, lectPeriods, schedule } = req.body;
    const subject: ISubject = new Subject({
      subjectName,
      labPeriods,
      tutPeriods,
      lectPeriods
    });

    const createSubject: ISubject = await subject.save();
    schedule.subjects = [...schedule.subjects, createSubject];
    const updateSchedule = await Schedule.findByIdAndUpdate(schedule._id, schedule).populate('subjects');
    res.json({ createSubject, updateSchedule, schedule });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { updatedSubject } = req.body;
    const result = await Subject.findByIdAndUpdate(req.params.id, updatedSubject).populate('labPeriods').populate('tutPeriods').populate('lectPeriods');
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('labPeriods').populate('tutPeriods').populate('lectPeriods');
    if (!subject) {
      return res.status(400).json({ msg: 'Subject not found' });
    }
    res.json(subject);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('lectPeriods').populate('labPeriods').populate('tutPeriods');
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }
    const schedule = req.body.schedule;
    schedule.subjects = schedule.subjects.filter((subject: { _id: string; }) => subject._id != req.params.id);
    const periods = [...subject.lectPeriods, ...subject.labPeriods, ...subject.tutPeriods ];

    const updateSchedule = await Schedule.findByIdAndUpdate(schedule._id, schedule);
    const deletePeriods = await Period.deleteMany({ _id: { $in: periods } });
    const deleteSubject = await Subject.deleteOne({ _id: subject._id });

    if (!deletePeriods || !deleteSubject || !updateSchedule) {
      return res.status(400).json({ msg: 'Could not delete' });
    }
    res.json({ msg: 'Deleted', schedule });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
