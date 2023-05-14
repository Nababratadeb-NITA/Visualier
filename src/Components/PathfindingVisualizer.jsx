import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

import "./PathfindingVisualizer.css";

// const START_NODE_ROW = 5;
// const START_NODE_COL = 2;
// const FINISH_NODE_ROW = 8;
// const FINISH_NODE_COL = 5;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: this.getInitialGrid(),
      mouseIsPressed: false,
      row: 10,
      col: 10,
      startNodeRow: 0,
      startNodeCol: 0,
      endNodeRow: 9,
      endNodeCol: 9,
    };
    this.handleNumRowsChange = this.handleNumRowsChange.bind(this);
    this.handleNumColumnsChange = this.handleNumColumnsChange.bind(this);
  }

  componentDidMount() {
    const { row, col, startNodeRow, startNodeCol, endNodeRow, endNodeCol } =
      this.state;
    const grid = this.getInitialGrid(
      row,
      col,
      startNodeRow,
      startNodeCol,
      endNodeRow,
      endNodeCol
    );
    this.setState({ grid });
  }

  handleNumRowsChange(event) {
    const row = parseInt(event.target.value);
    this.setState({ row });
  }

  handleNumColumnsChange(event) {
    const col = parseInt(event.target.value);
    this.setState({ col });
  }

  handleStartNodeRowChange = (event) => {
    this.setState({ startNodeRow: parseInt(event.target.value) });
  };

  handleStartNodeColChange = (event) => {
    this.setState({ startNodeCol: parseInt(event.target.value) });
  };

  handleEndNodeRowChange = (event) => {
    this.setState({ endNodeRow: parseInt(event.target.value) });
  };

  handleEndNodeColChange = (event) => {
    this.setState({ endNodeCol: parseInt(event.target.value) });
  };

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  getInitialGrid(row, col, startNodeRow, startNodeCol, endNodeRow, endNodeCol) {
    const grid = [];
    for (let r = 0; r < row; r++) {
      const currentRow = [];
      for (let c = 0; c < col; c++) {
        currentRow.push(
          this.createNode(
            c,
            r,
            startNodeCol,
            startNodeRow,
            endNodeCol,
            endNodeRow
          )
        );
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(c, r, startNodeCol, startNodeRow, endNodeCol, endNodeRow) {
    return {
      r,
      c,
      isStart: r === startNodeRow && c === startNodeCol,
      isFinish: r === endNodeRow && c === endNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  visualizeDijkstra() {
    const { grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol } =
      this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[endNodeRow][endNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {
      grid,
      mouseIsPressed,
      row,
      col,
      startNodeRow,
      startNodeCol,
      endNodeRow,
      endNodeCol,
    } = this.state;

    return (
      <div className="screen">
        <div>
          <label>
            Number of Rows:
            <input
              type="number"
              value={row}
              onChange={(event) => this.handleNumRowsChange(event)}
            />
          </label>
          <br />
          <label>
            Number of Columns:
            <input
              type="number"
              value={col}
              onChange={(event) => this.handleNumColumnsChange(event)}
            />
          </label>
          <br />
          <label htmlFor="startNodeRow">Start Node Row: </label>
          <input
            id="startNodeRow"
            type="number"
            value={startNodeRow}
            onChange={(event) => this.handleStartNodeRowChange(event)}
          />
          <label htmlFor="startNodeCol">Start Node Column: </label>
          <input
            id="startNodeCol"
            type="number"
            value={startNodeCol}
            onChange={(event) => this.handleStartNodeColChange(event)}
          />
          <label htmlFor="endNodeRow">End Node Row: </label>
          <input
            id="endNodeRow"
            type="number"
            value={endNodeRow}
            onChange={(event) => this.handleEndNodeRowChange(event)}
          />
          <label htmlFor="endNodeCol">End Node Column: </label>
          <input
            id="endNodeCol"
            type="number"
            value={endNodeCol}
            onChange={(event) => this.handleEndNodeColChange(event)}
          />
        </div>
        <button className="btn" onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
