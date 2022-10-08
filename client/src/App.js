import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Form from './Form'
import Navbar from './Navbar'
import Home from './Home'
import NotFound from './NotFound'

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar/>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/timetable" element={<Form/>}/>
            <Route path="*" element={<NotFound/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
