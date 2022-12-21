import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <h1><Link to="/" style={{"textDecoration":"none"}}>TimeTable Generator</Link></h1>
  );
};

export default Navbar;