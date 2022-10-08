const express = require("express");
const router = express.Router();
const Period = require("../models/Period");
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
    const { professor, groupNames, room, bans } = req.body;
    console.log(req.body);
    const period = new Period({
      professor,
      groupNames,
      room,
      bans
    });
    const result = await period.save();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.patch("/:id", async (req,res)=>{
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
    const period = await Period.findByIdAndDelete(req.params.id);
    if (!period) {
      return res.status(400).json({ msg: "Period not found" });
    }
    res.json(period);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;