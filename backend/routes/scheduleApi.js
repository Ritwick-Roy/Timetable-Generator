const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
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
    const updatedSchedule = req.body;
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
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(400).json({ msg: "schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;