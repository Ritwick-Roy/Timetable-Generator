import express from 'express';
import period from './period';
import schedule from './schedule';
import subject from './subject';
import timetable from './timetable';
const router = express.Router();

export default (): express.Router =>{
  period(router);
  subject(router);
  schedule(router);
  timetable(router);
  return router;
}