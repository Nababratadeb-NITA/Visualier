import React from "react";
import { DiCode } from "react-icons/di";
import "./Nav.css";

function Nav() {
  return (
    <div className="nav">
      <div className="nav_logo">
        Maze Game <DiCode className="nav__icon" />
      </div>
    </div>
  );
}

export default Nav;
