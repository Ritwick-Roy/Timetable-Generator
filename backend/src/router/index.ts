import express from 'express';
import schedule from './schedule';
const router = express.Router();

export default (): express.Router =>{
  schedule(router);
  return router;
}