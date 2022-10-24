import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { getBaseUrl } from '../src/utils';

const GenerateSchedule = () => {

    const location = useLocation();
    const [schedule, setSchedule] = useState(location.state.schedule);
    // const [subjectName, setSubjectName] = useState('');
    // const [refresh, setRefresh] = useState(false);
    const { scheduleId } = useParams();

    // useEffect(()=>{
    //     console.log(schedule);
    // },[refresh])

    useEffect(() => {
        axios.get(`${getBaseUrl()}/api/timetable/${scheduleId}`)
            .then((result) => {
                console.log(result.data);
                setSchedule(result.data);
            });
    }, []);

    return (
        <div>
            <h1>Generate schedule</h1>
            {/* {schedule} */}
        </div>
    )
}

export default GenerateSchedule