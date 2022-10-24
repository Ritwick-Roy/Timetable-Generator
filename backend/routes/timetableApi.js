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
    let i, j, k, input=schedule.days+" "+schedule.beforeBreak+" "+schedule.afterBreak+" "+schedule.subjects.length+" ";

    for(i=0;i<schedule.subjects.length;i++)
    {
        // reached subject level
        currSub=schedule.subjects[i];
        input+=currSub.subjectName+" "+currSub.lectPeriods.length+" ";
        for(j=0;j<currSub.lectPeriods.length;++j)
        {
            // reached period level
            const currPeriod = await Period.findById(currSub.lectPeriods[j]);
            input+=currPeriod.professor+" "+currPeriod.groupNames.length+" ";
            for(k=0;k<currPeriod.groupNames.length;++k)
            {
                input+=currPeriod.groupNames[k]+" ";
            }
            input+=currPeriod.room+" "+currPeriod.bans+" ";
        }
        input+=currSub.labPeriods.length+" ";
        for(j=0;j<currSub.labPeriods.length;++j)
        {
            // reached period level
            const currPeriod = await Period.findById(currSub.labPeriods[j]);
            input+=currPeriod.professor+" "+currPeriod.groupNames.length+" ";
            for(k=0;k<currPeriod.groupNames.length;++k)
            {
                input+=currPeriod.groupNames[k]+" ";
            }
            input+=currPeriod.room+" "+currPeriod.bans+" ";
        }
        input+=currSub.tutPeriods.length+" ";
        for(j=0;j<currSub.tutPeriods.length;++j)
        {
            // reached period level
            const currPeriod = await Period.findById(currSub.tutPeriods[j]);
            input+=currPeriod.professor+" "+currPeriod.groupNames.length+" ";
            for(k=0;k<currPeriod.groupNames.length;++k)
            {
                input+=currPeriod.groupNames[k]+" ";
            }
            input+=currPeriod.room+" "+currPeriod.bans+" ";
        }

    }

    axios.post('http://127.0.0.1:8000',{
        input
        // 'input':'5 5 4  6 NA 3 tina 4 L1 L2 M1 M2 audi none tina 4 L1 L2 M1 M2 audi none tina 4 L1 L2 M1 M2 audi none 0 4 tina 1 L1 C1 none tina 1 L2 C1 none pankaj 1 M1 C2 none pankaj 1 M2 C2 none DMS 3 vivek 4 L1 L2 M1 M2 audi none vivek 4 L1 L2 M1 M2 audi none vivek 4 L1 L2 M1 M2 audi none 4 vivek 1 L1 S1 none vivek 1 L2 S1 none vivek 1 M1 S1 none vivek 1 M2 S1 none 0 CAO 3 vivek 4 L1 L2 M1 M2 audi none vivek 4 L1 L2 M1 M2 audi none vivek 4 L1 L2 M1 M2 audi none 0 0 PC 1 vivek 4 L1 L2 M1 M2 none audi 0 4 vivek 1 L1 C2 none manisha 1 L2 C1 none deep 1 M1 C2 none jain 1 M2 C2 none DSA 3 manisha 4 L1 L2  M1 M2 audi none manisha 4 L1 L2  M1 M2 audi none manisha 4 L1 L2  M1 M2 audi none 0 4 manisha 1 L1 C2 none manisha 1 L2 C2 none manisha 1 M1 C1 none manisha 1 M2 C1 none OS 3 jain 4 L1 L2  M1 M2 audi none jain 4 L1 L2  M1 M2 audi none jain 4 L1 L2  M1 M2 audi none 0 4 jain 1 L1 C2 none jain 1 L2 C2 none jain 1 M1 C1 none jain 1 M2 C2 none'
    },{
        headers:{
        'Content-Type':'application/json'
        }
    })
    .then((result)=>{
        // console.log(result.data);
        res.json(result.data);
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;