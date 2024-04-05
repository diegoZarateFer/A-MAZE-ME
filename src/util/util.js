export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getEmptyBoard = (width, height) => {
  const newBoard = [];
  for (let i = 0; i < height; i++) {
    newBoard[i] = [];
    for (let j = 0; j < width; j++) {
      newBoard[i][j] = {
        state: "unvisited",
        rightWall: true,
        leftWall: true,
        topWall: true,
        bottomWall: true,
      };
    }
  }

  return newBoard;
};

export const getEmptyMatrix = (width, height) => {
  const newMatrix = [];
  for (let i = 0; i < width; i++) {
    newMatrix[i] = [];
    for (let j = 0; j < height; j++) {
      newMatrix[i][j] = null;
    }
  }

  return newMatrix;
};

export const isValidCell = (matrix, cellX, cellY) => {
  return (
    cellX >= 0 &&
    cellX < matrix.length &&
    cellY >= 0 &&
    cellY < matrix[0].length
  );
};

export const getNeighborsDirections = (matrix, cellX, cellY, shuffle) => {
  const directions = [
    { dx: 1, dy: 0, name: "DOWN" },
    { dx: 0, dy: 1, name: "RIGHT" },
    { dx: -1, dy: 0, name: "UP" },
    { dx: 0, dy: -1, name: "LEFT" },
  ].filter(({ dx, dy }) => isValidCell(matrix, cellX + dx, cellY + dy));

  if (shuffle) return shuffleArray(directions);
  return directions;
};

export const unvisitAllCells = (matrix) => {
  matrix.forEach((row) => {
    row.forEach((cell) => {
      cell.state = "unvisited";
    });
  });
};

export const showPathCellsOnly = (matrix) => {
  matrix.forEach((row) => {
    row.forEach((cell) => {
      if (cell.state !== "part__of__path") cell.state = "unvisited";
    });
  });
};

export const getCellID = (row, col, numberOfCols) => {
  return col + row * numberOfCols;
};

export const carveWall = (matrix, wall, row, col) => {
  switch (wall) {
    case "RIGHT":
      matrix[row][col].rightWall = false;
      matrix[row][col + 1].leftWall = false;
      break;
    case "DOWN":
      matrix[row][col].bottomWall = false;
      matrix[row + 1][col].topWall = false;
      break;
    case "LEFT":
      matrix[row][col].leftWall = false;
      matrix[row][col - 1].rightWall = false;
      break;
    case "UP":
      matrix[row][col].topWall = false;
      matrix[row - 1][col].bottomWall = false;
      break;
  }
};

export const addAnimationFrame = (algortihmSteps, matrix) => {
  algortihmSteps.push([
    ...matrix.map((row) => [
      ...row.map((cell) => {
        return {
          ...cell,
        };
      }),
    ]),
  ]);
};
