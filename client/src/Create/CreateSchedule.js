import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';

const CreateSchedule = () => {

  const [refresh, setRefresh] = useState(false);
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
  }, [refresh]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post(`${getBaseUrl()}/api/schedule`,
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
    setName('');
    setDays(0);
    setBeforeBreak(0);
    setAfterBreak(0);
    setRefresh(!refresh);
  }

  return (
    <div>
      <h1>CreateSchedule</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="name">Schedule Name:</label>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name" />
        <label htmlFor="days">Days:</label>
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
        <div>
          <li key="schedule-name">Schedule name: {schedule.name}</li>
          <li key="numOfDays">Number of days: {schedule.days}</li>
          <li key="beforeBreak">Number of periods before break: {schedule.beforeBreak}</li>
          <li key="afterBreak">Number of periods after break: {schedule.afterBreak}</li>
          <Link to={`/schedule/${schedule._id}`} state={{schedule}}>Manage subjects</Link>
        </div>
      ))}
    </div>
  )
}

export default CreateSchedule;