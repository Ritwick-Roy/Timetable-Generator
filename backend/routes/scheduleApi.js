const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const Period = require("../models/Period");
const Subject = require("../models/Subject");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("subjects").populate("subjects.lectPeriods").populate("subjects.tutPeriods").populate("subjects.labPeriods");
    res.json(schedules);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, days, beforeBreak, afterBreak, subjects } = req.body;
    console.log(req.body);
    const schedule = new Schedule({
      name,
      days,
      beforeBreak,
      afterBreak,
      subjects
    });
    const result = await schedule.save();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}); 

router.patch("/:id", async (req,res)=>{
  try {
    const { updatedSchedule } = req.body;
    const result = await Schedule.findByIdAndUpdate(req.params.id, updatedSchedule).populate("subjects").populate("subjects.lectPeriods").populate("subjects.tutPeriods").populate("subjects.labPeriods");
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate("subjects").populate("subjects.lectPeriods").populate("subjects.tutPeriods").populate("subjects.labPeriods");
    if (!schedule) {
      return res.status(400).json({ msg: "schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const schedule=await Schedule.findById(req.params.id).populate("subjects");
    const subjects=schedule.subjects;
    const periods=[]
    subjects.map((subject)=>{
      subject.lectPeriods.map((lect)=>{
        periods.push(lect);
      })
      subject.labPeriods.map((lab)=>{
        periods.push(lab);
      })
      subject.tutPeriods.map((tut)=>{
        periods.push(tut);
      })
    })
    const deletePeriods = await Period.deleteMany({_id:{$in:periods}});
    const deleteSubjects = await Subject.deleteMany({_id:{$in:subjects}});
    const deleteSchedule = await Schedule.deleteOne({_id:schedule._id});

    if (!deleteSchedule || !deletePeriods || !deleteSubjects) {
      return res.status(400).json({ msg: "could not delete" });
    }
    res.json({subjects,periods,deletePeriods,deleteSubjects,deleteSchedule});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;