import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../utils';
import Schedule from '../pages/Schedule'

const GenerateSchedule = () => {

    const location = useLocation();
    const [schedule, setSchedule] = useState(location.state.schedule);
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(false);
    const { scheduleId } = useParams();

    useEffect(() => {
        setSchedule(location.state.schedule);
        axios.get(`${getBaseUrl()}/api/timetable/${scheduleId}`)
            .then((result) => {
                setPeriods(result.data);
                setLoading(true);
            });
    }, [location.state.schedule, scheduleId]);

    return (
        <div>
            <h1>Generate schedule</h1>
            {
                loading ? <Schedule rows={schedule.days} columns={schedule.beforeBreak + schedule.afterBreak} periods={periods} /> : (<div>Generating...</div>)
            }
        </div>
    )
}

export default GenerateSchedule