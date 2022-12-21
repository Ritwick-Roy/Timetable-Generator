import './App.css';
import React, { useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ManagePeriod from './Create/ManagePeriod'
import CreatePeriod from './Create/CreatePeriod'
import CreateSchedule from './Create/CreateSchedule'
import CreateSubject from './Create/CreateSubject'
import GenerateSchedule from './pages/GenerateSchedule';
import Footer from './components/Footer'
import Schedule from './pages/Schedule'

// import { Link } from "react-router-dom";
const App = () => {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

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
           <Route path="/schedule/:scheduleId/:subjectId/:periodId" element={<ManagePeriod />} />
           <Route path="/generate/:scheduleId" element={<GenerateSchedule/>} />
           <Route path="*" element={<NotFound />} />
         </Routes>
         <br/><br/>
         <Footer />
       </div>
       <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              "fullScreen": {
                  "zIndex": -1
              },
              "particles": {
                  "number": {
                      "value": 80,
                      "density": {
                          "enable": true,
                          "area": 800
                      }
                  },
                  "color": {
                      "value": "#ff0000",
                      "animation": {
                          "enable": true,
                          "speed": 20,
                          "sync": true
                      }
                  },
                  "opacity": {
                      "value": 0.5
                  },
                  "size": {
                      "value": {
                          "min": 0.1,
                          "max": 3
                      }
                  },
                  "links": {
                      "enable": true,
                      "distance": 150,
                      "color": "#ffffff",
                      "opacity": 0.4,
                      "width": 1
                  },
                  "move": {
                      "enable": true,
                      "speed": 3,
                      "direction": "none",
                      "outModes": {
                          "default": "out"
                      }
                  }
              },
              "interactivity": {
                  "events": {
                      "onHover": {
                          "enable": true,
                          "mode": "repulse"
                      },
                      "onClick": {
                          "enable": true,
                          "mode": "push"
                      }
                  },
                  "modes": {
                      "repulse": {
                          "distance": 200
                      },
                      "push": {
                          "quantity": 4
                      }
                  }
              },
              "background": {
                  "color": "#000000"
              }
          }}
        />  
     </Router>
    );
};
export default App;