import React, { Component } from "react";
import "./App.css";
import Nav from "./Components/Nav";
import PathfindingVisualizer from "./Components/PathfindingVisualizer";

export default class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <PathfindingVisualizer />
      </div>
    );
  }
}
