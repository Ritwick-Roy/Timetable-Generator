const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Period = require("../models/Period");
const Schedule = require("../models/Schedule");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().populate("labPeriods").populate("tutPeriods").populate("lectPeriods");
    res.json(subjects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { subjectName, labPeriods, tutPeriods, lectPeriods } = req.body;
    const subject = new Subject({
      subjectName,
      labPeriods,
      tutPeriods,
      lectPeriods
    });
    const result = await subject.save();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { updatedSubject } = req.body;
    console.log(updatedSubject);
    const result = await Subject.findByIdAndUpdate(req.params.id, updatedSubject).populate("labPeriods").populate("tutPeriods").populate("lectPeriods");
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("labPeriods").populate("tutPeriods").populate("lectPeriods");
    if (!subject) {
      return res.status(400).json({ msg: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("lectPeriods").populate("labPeriods").populate("tutPeriods");
    const schedule=req.body.schedule;
    schedule.subjects=schedule.subjects.filter((subject)=>{return subject!=req.params.id});
    const periods = []
    subject.lectPeriods.map((lect) => {
      periods.push(lect);
    })
    subject.labPeriods.map((lab) => {
      periods.push(lab);
    })
    subject.tutPeriods.map((tut) => {
      periods.push(tut);
    })
    
    const updateSchedule = await Schedule.findByIdAndUpdate({_id:schedule._id},schedule);
    const deletePeriods = await Period.deleteMany({ _id: { $in: periods } });
    const deleteSubject = await Subject.deleteOne({ _id: subject._id });

    if (!deletePeriods || !deleteSubject || !updateSchedule) {
      return res.status(400).json({ msg: "could not delete" });
    }
    res.json({msg:"deleted"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;