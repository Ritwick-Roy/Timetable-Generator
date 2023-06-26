import express from 'express';
import { getSubject, getAllSubjects, addSubject, updateSubject, deleteSubject } from '../controllers/subjectApi';

export default (router: express.Router ) => {

  router.get('/api/subject', getAllSubjects);
  router.get('/api/subject/:id', getSubject);
  router.post('/api/subject', addSubject);
  router.patch('/api/subject/:id', updateSubject);
  router.delete('/api/subject/:id', deleteSubject);

}