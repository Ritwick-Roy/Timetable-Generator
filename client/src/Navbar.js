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
        <h1>Sputnik</h1>
      </Link>
      <div className="links">
        <Link
          className="predict-link"
          to="/timetable"
          style={{
            color: isHovering ? "#333":"white",
            backgroundColor: isHovering ? "":"#09a188",
            borderRadius: "8px",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Timetable
        </Link>
        <Link to="/schedule">Create Schedule</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;