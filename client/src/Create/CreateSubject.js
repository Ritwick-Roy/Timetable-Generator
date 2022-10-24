import React, { useState } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';

const CreateSubject = () => {

  const location = useLocation();
  const [schedule, setSchedule] = useState(location.state.schedule);
  const [subjectName, setSubjectName] = useState('');
  const { scheduleId } = useParams();

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${getBaseUrl()}/api/subject`,
      {
        subjectName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
    
    const new_schedule=schedule;
    new_schedule.subjects=[...schedule.subjects,res.data];
    setSchedule(new_schedule);
    // setSchedule((s)=>({...s,subjects:[...s.subjects,res.data]}));

    await axios.patch(`${getBaseUrl()}/api/schedule/${scheduleId}`,
      {
        updatedSchedule:schedule
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    setSubjectName('');
  }

  return (
    <div>
      <h1>CreateSubject</h1>

      <div>
        <li key="schedule-name">Schedule name: {schedule.name}</li>
        <li key="numOfDays">Number of days: {schedule.days}</li>
        <li key="beforeBreak">Number of periods before break: {schedule.beforeBreak}</li>
        <li key="afterBreak">Number of periods after break: {schedule.afterBreak}</li>
      </div>

      <form onSubmit={submitHandler}>
        <label htmlFor="name">Subjects Name:</label>
        <input
          type="text"
          placeholder='name'
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          name="name" />
        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
      {schedule.subjects.map((subject) => (
        <div>
          <li>{subject.subjectName}</li>
          <Link to={`/schedule/${scheduleId}/${subject._id}`} state={{ subject,schedule }}>Manage Periods</Link>
        </div>
      ))}
    </div>
  )
}

export default CreateSubject;