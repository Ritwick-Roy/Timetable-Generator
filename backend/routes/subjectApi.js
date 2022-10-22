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
    console.log(req.body);
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

    const schedules = await Schedule.find();

    schedules.forEach(async (schedule) => {
      schedule.subjects.filter((ele) => { ele != req.params.id });
      await Schedule.findByIdAndUpdate(schedule._id, schedule);
    });

    const subjects = await Subject.findById(req.params.id);

    subjects.lectPeriods.forEach(async (period) => {
      await Period.findByIdAndDelete(period._id);
    })
    subjects.labPeriods.forEach(async (period) => {
      await Period.findByIdAndDelete(period._id);
    })
    subjects.tutPeriods.forEach(async (period) => {
      await Period.findByIdAndDelete(period._id);
    })

    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(400).json({ msg: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;