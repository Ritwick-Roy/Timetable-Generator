import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';

const CreateSubject = () => {

  const location = useLocation();
  const [schedule, setSchedule] = useState(location.state.schedule);
  const [subjectName, setSubjectName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const { scheduleId } = useParams();

  useEffect(() => {
    axios.get(`${getBaseUrl()}/api/schedule/${scheduleId}`)
      .then((res) => {
        setSchedule(res.data);
      })
  }, [scheduleId])

  const submitHandler = async (e) => {
    e.preventDefault();
    const postSubject = await axios.post(`${getBaseUrl()}/api/subject`,
      {
        subjectName,
        schedule
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    setSchedule(postSubject.data.schedule);
    setSubjectName('');
  }

  const deleteHandler = async (e, subjectId) => {
    e.preventDefault();
    const deleteSubject = await axios.delete(`${getBaseUrl()}/api/subject/${subjectId}`,
      {
        data: {
          schedule
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
    setSchedule(deleteSubject.data.schedule);
    setRefresh(!refresh);
  }

  return (
    <div>
      {refresh}
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
          <Link to={`/schedule/${scheduleId}/${subject._id}`} state={{ subject, schedule }}>Manage Periods</Link>
          <button onClick={(e) => deleteHandler(e, subject._id)}>Delete subject</button>
        </div>
      ))}
    </div>
  )
}

export default CreateSubject;