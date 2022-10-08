const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
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

router.patch("/:id", async (req,res)=>{
  try {
    const updatedSubject = req.body;
    const result = await Subject.findByIdAndUpdate(req.params.id, updatedSubject).populate("labPeriods").populate("tutPeriods").populate("lectPeriods");
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