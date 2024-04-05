import {
  addAnimationFrame,
  carveWall,
  getCellID,
  getNeighborsDirections,
  getRandomInteger,
  isValidCell,
  shuffleArray,
  unvisitAllCells,
} from "../util/util";

import DSU from "../util/data-structures/DSU";

/*
  Recursive DFS to generate a new maze.
*/
const DFSMazeGenerationHelper = (
  matrix,
  algortihmSteps,
  currentCellX,
  currentCellY
) => {
  algortihmSteps.push({
    action: "VISIT_CELL",
    row: currentCellX,
    col: currentCellY,
  });

  matrix[currentCellX][currentCellY].state = "visited";
  const neighbors = getNeighborsDirections(
    matrix,
    currentCellX,
    currentCellY,
    true
  );

  for (let { dx, dy, name } of neighbors) {
    const newCellX = currentCellX + dx;
    const newCellY = currentCellY + dy;

    if (matrix[newCellX][newCellY].state === "unvisited") {
      carveWall(matrix, name, currentCellX, currentCellY);
      algortihmSteps.push({
        action: "CARVE_WALL",
        wall: name,
      });
      DFSMazeGenerationHelper(matrix, algortihmSteps, newCellX, newCellY);
      algortihmSteps.push({
        action: "VISIT_CELL",
        row: currentCellX,
        col: currentCellY,
      });
    }
  }
};

/*
  Returns an array of two elements:
  - A list containing the order in which cells are visited and the walls that are removed
    in each step.
  - The final board containning the generated maze.
*/
export const DFSMazeGeneration = (matrix, startingCellX, startingCellY) => {
  const algortihmSteps = [];
  DFSMazeGenerationHelper(matrix, algortihmSteps, startingCellX, startingCellY);
  unvisitAllCells(matrix);
  return [algortihmSteps, matrix];
};

/*
  Returns an array of two elements:
  - A list containing the order in which cells are visited and the walls that are removed
    in each step.
  - The final board containning the generated maze.
*/
export const BinaryTreeMazeGeneration = (matrix) => {
  const algortihmSteps = [];
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      algortihmSteps.push({
        action: "VISIT_CELL",
        row,
        col,
      });

      if (
        isValidCell(matrix, row - 1, col) &&
        isValidCell(matrix, row, col + 1)
      ) {
        if (getRandomInteger(0, 1) === 0) {
          // Removing north wall of cell.
          carveWall(matrix, "UP", row, col);
          algortihmSteps.push({
            action: "CARVE_WALL",
            row,
            col,
            wall: "UP",
          });
        } else {
          // Removing east wall of cell.
          carveWall(matrix, "RIGHT", row, col);
          algortihmSteps.push({
            action: "CARVE_WALL",
            row,
            col,
            wall: "RIGHT",
          });
        }
      } else if (isValidCell(matrix, row - 1, col)) {
        // Removing north wall of cell.
        carveWall(matrix, "UP", row, col);
        algortihmSteps.push({
          action: "CARVE_WALL",
          row,
          col,
          wall: "UP",
        });
      } else if (isValidCell(matrix, row, col + 1)) {
        // Removing east wall of cell.
        carveWall(matrix, "RIGHT", row, col);
        algortihmSteps.push({
          action: "CARVE_WALL",
          row,
          col,
          wall: "RIGHT",
        });
      }
    }
  }

  unvisitAllCells(matrix);
  return [algortihmSteps, matrix];
};

export const KruskalMazeGeneration = (matrix) => {
  const listOfWalls = [];
  const dsu = new DSU();
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (isValidCell(matrix, row, col + 1)) {
        listOfWalls.push({
          rowOne: row,
          colOne: col,
          rowTwo: row,
          colTwo: col + 1,
          wall: "RIGHT",
        });
      }

      if (isValidCell(matrix, row + 1, col)) {
        listOfWalls.push({
          rowOne: row,
          colOne: col,
          rowTwo: row + 1,
          colTwo: col,
          wall: "DOWN",
        });
      }
    }
  }

  const algortihmSteps = [];
  shuffleArray(listOfWalls);
  for (let { rowOne, colOne, wall, rowTwo, colTwo } of listOfWalls) {
    const cellOneID = getCellID(rowOne, colOne, matrix[0].length);
    const cellTwoID = getCellID(rowTwo, colTwo, matrix[0].length);

    algortihmSteps.push({
      action: "VISIT_CELL",
      row: rowOne,
      col: colOne,
    });

    if (dsu.find(cellOneID) !== dsu.find(cellTwoID)) {
      carveWall(matrix, wall, rowOne, colOne);
      algortihmSteps.push({
        action: "CARVE_WALL",
        wall,
      });
      dsu.union(cellOneID, cellTwoID);
    }
  }

  return [algortihmSteps, matrix];
};
