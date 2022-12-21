import React, { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>TimeTable Generator</h1>
      </Link>
      {/* <div className="links">
        <Link
          className="predict-link"
          to="/schedule"
          style={{
            color: isHovering ? "#333":"white",
            backgroundColor: isHovering ? "":"#09a188",
            borderRadius: "8px",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Schedules
        </Link> */}
        {/* <Link to="/schedule">Schedules</Link> */}
        {/* <Link to="/about">About</Link>
      </div> */}
    </nav>
  );
};

export default Navbar;