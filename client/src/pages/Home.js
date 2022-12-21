import React from "react";
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div className="home">
      <h2>Description</h2>
      To generate schedules enter the required information about the subjects, its periods and the corresponding period info. The number of working days and periods/ time slots in a day are also to be entered. A graph is initalised with the periods as nodes and "constraints" as edges and it is then colored to find the ordering of periods.
      The data for a schedule stored on a database i.e. MongoDB is sent from the backend node server to cpp web server where the ordering takes place and sent back to the node server. The final data is then rendered on the screen.
      <br/>
      <br/>
      <Link to="/schedule"
      style={{
            // color: isHovering ? "#333":"white",
            // backgroundColor: isHovering ? "":"#09a188",
            borderRadius: "8px",
            display:"block"
          }}
          >Go to Schedules page</Link> 
    </div>
  );
};

export default Home;