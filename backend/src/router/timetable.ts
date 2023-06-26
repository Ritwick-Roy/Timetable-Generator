import express from "express";
import { generateTimetable } from "../controllers/timetableApi";

export default (router: express.Router ) => {

  router.get('/api/timetable/:scheduleId', generateTimetable);

}