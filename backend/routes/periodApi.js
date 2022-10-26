const express = require("express");
const router = express.Router();
const Period = require("../models/Period");
const Subject = require("../models/Subject");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const periods = await Period.find();
    res.json(periods);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { professor, groupNames, room, bans, subject, periodType } = req.body;
    const period = new Period({
      professor,
      groupNames,
      room,
      bans
    });
    const createPeriod = await period.save();
    if (periodType === "lab") {
      subject.labPeriods = [...subject.labPeriods, createPeriod];
    }
    else if (periodType === "lect") {
      subject.lectPeriods = [...subject.lectPeriods, createPeriod];
    }
    else {
      subject.tutPeriods = [...subject.tutPeriods, createPeriod];
    }
    await Subject.findByIdAndUpdate({ _id: subject._id }, subject).populate("lectPeriods").populate("labPeriods").populate("tutPeriods");
    res.json({ createPeriod, subject });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedPeriod = req.body;
    const result = await Period.findByIdAndUpdate(req.params.id, updatedPeriod);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    if (!period) {
      return res.status(400).json({ msg: "Period not found" });
    }
    res.json(period);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subject = req.body.subject;

    subject.lectPeriods = subject.lectPeriods.filter((ele) => { return ele._id != req.params.id });
    subject.labPeriods = subject.labPeriods.filter((ele) => { return ele._id != req.params.id });
    subject.tutPeriods = subject.tutPeriods.filter((ele) => { return ele._id != req.params.id });

    const result = await Subject.findByIdAndUpdate({ _id: subject._id }, subject);
    const period = await Period.findByIdAndDelete(req.params.id);
    if (!period || !result) {
      return res.status(400).json({ msg: "could not delete" });
    }
    res.json({ msg: "deleted" , subject});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;