import express from 'express';
import period from './period';
import schedule from './schedule';
import subject from './subject';
const router = express.Router();

export default (): express.Router =>{
  period(router);
  subject(router);
  schedule(router);
  return router;
}