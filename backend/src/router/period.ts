import express from 'express';
import { getPeriod, getAllPeriods, addPeriod, updatePeriod, deletePeriod } from '../controllers/periodApi';

export default (router: express.Router ) => {

  router.get('/api/period', getAllPeriods);
  router.get('/api/period/:id', getPeriod);
  router.post('/api/period', addPeriod);
  router.patch('/api/period/:id', updatePeriod);
  router.delete('/api/period/:id', deletePeriod);

}