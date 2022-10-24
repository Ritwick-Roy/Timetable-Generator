import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './Form'
import Navbar from './Navbar'
import Home from './Home'
import NotFound from './NotFound'
import CreatePeriod from './Create/CreatePeriod'
import CreateSchedule from './Create/CreateSchedule'
import CreateSubject from './Create/CreateSubject'
import GenerateSchedule from './GenerateSchedule';
import Footer from './components/Footer'

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/timetable" element={<Form />} />
          <Route path="/schedule" element={<CreateSchedule />} />
          <Route path="/schedule/:scheduleId" element={<CreateSubject />} />
          <Route path="/schedule/:scheduleId/:subjectId" element={<CreatePeriod />} />
          <Route path="/generate/:scheduleId" element={<GenerateSchedule/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;