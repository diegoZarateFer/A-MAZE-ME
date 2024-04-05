import Queue from "../util/data-structures/queue";
import {
  addAnimationFrame,
  getEmptyMatrix,
  isValidCell,
  unvisitAllCells,
} from "../util/util";

const reconstructPath = (algortihmSteps, matrix, ancestors, targetCell) => {
  let { row, col } = targetCell;
  while (ancestors[row][col] !== null) {
    algortihmSteps.push({
      action: "MAKE_PART_OF_PATH",
      row,
      col,
    });
    const ancestor = ancestors[row][col];
    row = ancestor.row;
    col = ancestor.col;
  }

  algortihmSteps.push({
    action: "MAKE_PART_OF_PATH",
    row,
    col,
  });
};

export const DijkstraAlgorithm = (matrix, startingCell, targetCell) => {
  unvisitAllCells(matrix);
  const algortihmSteps = [];
  const ancestors = getEmptyMatrix(matrix.length, matrix[0].length);

  const Q = new Queue();
  Q.enqueue(startingCell);

  // Add starting cell to the queue.
  algortihmSteps.push({
    action: "ENQUEUE",
    row: startingCell.row,
    col: startingCell.col,
  });

  while (!Q.isEmpty()) {
    const { row, col } = Q.dequeue();
    algortihmSteps.push({
      action: "VISIT_CELL",
      row,
      col,
    });

    matrix[row][col].state = "visited";

    // Reaching target cell.
    if (targetCell.row === row && targetCell.col === col) {
      reconstructPath(algortihmSteps, matrix, ancestors, targetCell);
      unvisitAllCells(matrix);
      return algortihmSteps;
    }

    // Adding neighbor cells to the queue.
    if (
      isValidCell(matrix, row + 1, col) &&
      matrix[row + 1][col].state === "unvisited" &&
      !matrix[row][col].bottomWall
    ) {
      Q.enqueue({
        row: row + 1,
        col: col,
      });
      ancestors[row + 1][col] = {
        row,
        col,
      };
      algortihmSteps.push({
        action: "ENQUEUE",
        direction: "DOWN",
        row,
        col,
      });
    }

    if (
      isValidCell(matrix, row, col + 1) &&
      matrix[row][col + 1].state === "unvisited" &&
      !matrix[row][col].rightWall
    ) {
      Q.enqueue({
        row: row,
        col: col + 1,
      });
      ancestors[row][col + 1] = {
        row,
        col,
      };
      algortihmSteps.push({
        action: "ENQUEUE",
        direction: "RIGHT",
        row,
        col,
      });
    }

    if (
      isValidCell(matrix, row - 1, col) &&
      matrix[row - 1][col].state === "unvisited" &&
      !matrix[row][col].topWall
    ) {
      Q.enqueue({
        row: row - 1,
        col: col,
      });
      ancestors[row - 1][col] = {
        row,
        col,
      };
      algortihmSteps.push({
        action: "ENQUEUE",
        direction: "UP",
        row,
        col,
      });
    }

    if (
      isValidCell(matrix, row, col - 1) &&
      matrix[row][col - 1].state === "unvisited" &&
      !matrix[row][col].leftWall
    ) {
      Q.enqueue({
        row: row,
        col: col - 1,
      });
      ancestors[row][col - 1] = {
        row,
        col,
      };
      algortihmSteps.push({
        action: "ENQUEUE",
        direction: "LEFT",
        row,
        col,
      });
    }
  }

  unvisitAllCells(matrix);
  return algortihmSteps;
};
