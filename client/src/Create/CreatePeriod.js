import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';
import Table from '../Table'
const CreatePeriod = () => {

  const location = useLocation();
  const [schedule, setSchedule] = useState('');
  const [subject, setSubject] = useState(location.state.subject);
  const [professor, setProfessor] = useState('');
  const [room, setRoom] = useState('');
  const [groupNames, setGroupNames] = useState([]);
  const [bans, setBans] = useState('');
  const [periodType, setPeriodType] = useState('lab');
  const { subjectId } = useParams();

  useEffect(() => {
    setSchedule(location.state.schedule);
    let res="";
    for(let i=0;i<location.state.schedule.days*(location.state.schedule.beforeBreak+location.state.schedule.afterBreak);++i)
    res+=1;
    console.log(res);
    setBans(res);
    axios.get(`${getBaseUrl()}/api/subject/${subjectId}`)
      .then((res) => setSubject(res.data));
    console.log(schedule);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitHandler = async (e) => {
    e.preventDefault();
    const groupName = groupNames.split(',');
    const period = await axios.post(`${getBaseUrl()}/api/period`,
      {
        professor,
        room,
        groupNames: groupName,
        bans
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    const new_subject = subject;
    console.log(periodType);
    if (periodType === "lab") {
      new_subject.labPeriods = [...subject.labPeriods, period.data];
    }
    else if (periodType === "lect") {
      new_subject.lectPeriods = [...subject.lectPeriods, period.data];
    }
    else {
      new_subject.tutPeriods = [...subject.tutPeriods, period.data];
    }
    setSubject(new_subject);

    await axios.patch(`${getBaseUrl()}/api/subject/${subjectId}`,
      {
        updatedSubject: subject
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      });
    setProfessor('');
    setRoom('');
    setGroupNames([]);
  }

  return (
    <div className="period">
      <h1>CreatePeriod</h1>

      {
        location.state.schedule ? (<div>
          <li key="schedule-name">Schedule name: {schedule.name}</li>
          <li key="numOfDays">Number of days: {schedule.days}</li>
          <li key="beforeBreak">Number of periods before break: {schedule.beforeBreak}</li>
          <li key="afterBreak">Number of periods after break: {schedule.afterBreak}</li>
        </div>) : (<p>Empty</p>)
      }
      {
        location.state.subject ? (<h2>Subject: {subject.subjectName}</h2>) : (<p>Empty</p>)
      }

      <form onSubmit={submitHandler}>
        <label htmlfor="period-type">Choose period type:
          <select name="period-type" id="period-type" value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
            <option value="lab">Lab</option>
            <option value="lect">Lecture</option>
            <option value="tut">Tutorial</option>log
          </select>
        </label>
        <label htmlFor="professor">Professor:</label>
        <input
          type="text"
          placeholder='name'
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          name="name" />
        <label htmlFor="room">Room:</label>
        <input
          type="text"
          placeholder='L223'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          name="days" />
        <label htmlFor="groupNames">Names of groups (comma seperated):</label>
        <input
          type="text"
          placeholder='A,B,C..'
          value={groupNames}
          onChange={(e) => setGroupNames(e.target.value)}
          name="days" />
        Bans: {bans}
        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
      <Table rows={schedule.days} columns={schedule.beforeBreak + schedule.afterBreak} setBans={setBans} />

      {subject.lectPeriods.length && (<h3>Lectures:</h3>)}
      {subject.lectPeriods.map((period) => (
        <div>
          <li>Faculty:{period.professor}</li>
          <li>Room:{period.room}</li>
          <li>Allowed slots:{period.bans}</li>
          <li>Batches:{period.groupNames}</li>
          <br/>
        </div>
      ))}
      {subject.labPeriods.length && (<h3>Labs:</h3>)}
      {subject.labPeriods.map((period) => (
        <div>
          <li>Faculty:{period.professor}</li>
          <li>Room:{period.room}</li>
          <li>Allowed slots:{period.bans}</li>
          <li>Batches:{period.groupNames}</li>
          <br/>
        </div>
      ))}
      {subject.tutPeriods.length && (<h3>Tuts:</h3>)}
      {subject.tutPeriods.map((period) => (
        <div>
          <li>Faculty:{period.professor}</li>
          <li>Room:{period.room}</li>
          <li>Allowed slots:{period.bans}</li>
          <li>Batches:{period.groupNames}</li>
          <br/>
        </div>
      ))}
    </div>
  )
}

export default CreatePeriod;