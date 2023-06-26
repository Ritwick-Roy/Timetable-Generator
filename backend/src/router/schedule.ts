import express from 'express';
import { getSchedule, getAllSchedules, addSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleApi';

export default (router: express.Router ) => {

  router.get('/api/schedule', getAllSchedules);
  router.get('/api/schedule/:id', getSchedule);
  router.post('/api/schedule', addSchedule);
  router.patch('/api/schedule/:id', updateSchedule);
  router.delete('/api/schedule/:id', deleteSchedule);

}