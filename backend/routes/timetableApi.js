const express = require("express");
const router = express.Router();
const axios = require('axios');
const Schedule = require("../models/Schedule");
const Period = require("../models/Period");
const Subject = require("../models/Subject");
require("dotenv").config();

router.get("/:scheduleId", async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.scheduleId).populate("subjects");
        let i, j, k, input = schedule.days + " " + schedule.beforeBreak + " " + schedule.afterBreak + " " + schedule.subjects.length + " ";

        for (i = 0; i < schedule.subjects.length; i++) {
            // reached subject level
            currSub = schedule.subjects[i];
            input += currSub.subjectName + " " + currSub.lectPeriods.length + " ";
            for (j = 0; j < currSub.lectPeriods.length; ++j) {
                // reached period level
                const currPeriod = await Period.findById(currSub.lectPeriods[j]);
                input += currPeriod.professor + " " + currPeriod.groupNames.length + " ";
                for (k = 0; k < currPeriod.groupNames.length; ++k) {
                    input += currPeriod.groupNames[k] + " ";
                }
                input += currPeriod.room + " " + currPeriod.bans + " ";
            }
            input += currSub.labPeriods.length + " ";
            for (j = 0; j < currSub.labPeriods.length; ++j) {
                // reached period level
                const currPeriod = await Period.findById(currSub.labPeriods[j]);
                input += currPeriod.professor + " " + currPeriod.groupNames.length + " ";
                for (k = 0; k < currPeriod.groupNames.length; ++k) {
                    input += currPeriod.groupNames[k] + " ";
                }
                input += currPeriod.room + " " + currPeriod.bans + " ";
            }
            input += currSub.tutPeriods.length + " ";
            for (j = 0; j < currSub.tutPeriods.length; ++j) {
                // reached period level
                const currPeriod = await Period.findById(currSub.tutPeriods[j]);
                input += currPeriod.professor + " " + currPeriod.groupNames.length + " ";
                for (k = 0; k < currPeriod.groupNames.length; ++k) {
                    input += currPeriod.groupNames[k] + " ";
                }
                input += currPeriod.room + " " + currPeriod.bans + " ";
            }

        }

        axios.post('http://localhost:8000', {
            input
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((result) => {
                res.json(result.data);
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;