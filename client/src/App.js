import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import CreatePeriod from './Create/CreatePeriod'
import CreateSchedule from './Create/CreateSchedule'
import CreateSubject from './Create/CreateSubject'
import GenerateSchedule from './pages/GenerateSchedule';
import Footer from './components/Footer'
import Schedule from './pages/Schedule'

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/schedule" element={<CreateSchedule />} />
          <Route path="/rough" element={<Schedule />} />
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