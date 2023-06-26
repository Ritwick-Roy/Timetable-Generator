import { Request, Response } from "express";
import Period from "../models/Period";
import Subject from "../models/Subject";
import { IPeriod } from "../types/Period";
import { ISubject } from "../types/Subject";

export const getAllPeriods = async (req: Request, res: Response) => {
  try {
    const periods: IPeriod[] = await Period.find();
    res.json(periods);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export const addPeriod = async (req: Request, res: Response) => {
  try {
    const { professor, groupNames, room, bans, subject, periodType } = req.body;
    const period: IPeriod = new Period({
      professor,
      groupNames,
      room,
      bans,
    });
    const createPeriod: IPeriod = await period.save();
    if (periodType === "lab") {
      subject.labPeriods = [...subject.labPeriods, createPeriod];
    } else if (periodType === "lect") {
      subject.lectPeriods = [...subject.lectPeriods, createPeriod];
    } else {
      subject.tutPeriods = [...subject.tutPeriods, createPeriod];
    }
    await Subject.findByIdAndUpdate({ _id: subject._id }, subject).populate(
      "lectPeriods"
    ).populate("labPeriods").populate("tutPeriods");
    res.json({ createPeriod, subject });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export const updatePeriod = async (req: Request, res: Response) => {
  try {
    const updatedPeriod: IPeriod = req.body;
    const result: IPeriod | null = await Period.findByIdAndUpdate(
      req.params.id,
      updatedPeriod
    );
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

export const getPeriod = async (req: Request, res: Response) => {
  try {
    const period: IPeriod | null = await Period.findById(req.params.id);
    if (!period) {
      return res.status(400).json({ msg: "Period not found" });
    }
    res.json(period);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}
export const deletePeriod = async (req: Request, res: Response) => {
  try {
    const subjectId = req.body.subject._id;
    const periodId = req.params.id;

    // Filter out the period from the subject's lectPeriods, labPeriods, and tutPeriods arrays
    const subject: ISubject | null = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    subject.lectPeriods = subject.lectPeriods.filter((ele) => ele._id != periodId);
    subject.labPeriods = subject.labPeriods.filter((ele) => ele._id != periodId);
    subject.tutPeriods = subject.tutPeriods.filter((ele) => ele._id != periodId);

    // Update the subject with the modified arrays
    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, subject);
    if (!updatedSubject) {
      return res.status(400).json({ msg: 'Could not update subject' });
    }

    // Delete the period
    const deletedPeriod = await Period.findByIdAndDelete(periodId);
    if (!deletedPeriod) {
      return res.status(400).json({ msg: 'Could not delete period' });
    }

    res.json({ msg: 'Period deleted successfully', subject });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};