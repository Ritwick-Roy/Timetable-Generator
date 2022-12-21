import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';

const CreateSchedule = () => {

  const [name, setName] = useState('');
  const [days, setDays] = useState(0);
  const [beforeBreak, setBeforeBreak] = useState(0);
  const [afterBreak, setAfterBreak] = useState(0);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get(`${getBaseUrl()}/api/schedule`)
      .then((res) => {
        setSchedules(res.data);
      });
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${getBaseUrl()}/api/schedule`,
      {
        name,
        days,
        beforeBreak,
        afterBreak
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    const new_schedules = schedules;
    new_schedules.push(res.data);
    setSchedules(new_schedules);
    setName('');
    setDays(0);
    setBeforeBreak(0);
    setAfterBreak(0);
  }

  const deleteHandler = async (e, scheduleId) => {
    e.preventDefault();
    await axios.delete(`${getBaseUrl()}/api/schedule/${scheduleId}`, {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    const new_schedules=schedules.filter((schedule)=>{ return schedule._id !== scheduleId})
    setSchedules(new_schedules);
  }

  return (
    <div>
      <h2>Schedules</h2>
      <form onSubmit={submitHandler}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name" />
        <label htmlFor="days">Active days weekly:</label>
        <input
          type="number"
          placeholder="0"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          name="days" />
        <label htmlFor="beforeBreak">Number of periods before break:</label>
        <input
          type="number"
          placeholder="0"
          value={beforeBreak}
          onChange={(e) => setBeforeBreak(e.target.value)}
          name="days" />
        <label htmlFor="afterBreak">Number of periods after break:</label>
        <input
          type="number"
          placeholder="0"
          value={afterBreak}
          onChange={(e) => setAfterBreak(e.target.value)}
          name="days" />
        <button type="submit" value="Submit">
          Add schedule
        </button>
      </form>
      {schedules.map((schedule) => (
        <div className="container">
          <li key="schedule-name"><b>Schedule name:</b> <span className="value">{schedule.name}</span></li>
          <li key="numOfDays"><b>Number of days:</b> <span className="value">{schedule.days}</span></li>
          <li key="beforeBreak"><b>Number of periods before break:</b> <span className="value">{schedule.beforeBreak}</span></li>
          <li key="afterBreak"><b>Number of periods after break:</b> <span className="value">{schedule.afterBreak}</span></li>
          <Link to={`/generate/${schedule._id}`} state={{ schedule }}>Generate schedule</Link>{'  '}
          <Link to={`/schedule/${schedule._id}`} state={{ schedule }}>Manage subjects</Link>{'  '}
          <button onClick={(e) => deleteHandler(e, schedule._id)}>Delete schedule</button>
        </div>
      ))}
    </div>
  )
}

export default CreateSchedule;