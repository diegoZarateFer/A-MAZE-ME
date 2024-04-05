import {
  CardContent,
  Slider,
  Typography,
  Card,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ThemeProvider,
  createTheme,
  CssBaseline,
  RadioGroup,
  useMediaQuery,
} from "@mui/material";

import { RxGithubLogo } from "react-icons/rx";

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Board from "./components/Board/Board";

import { carveWall, getEmptyBoard, unvisitAllCells } from "./util/util";
import {
  INITIAL_ANIMATION_SPEED,
  INITIAL_BOARD_HEIGHT,
  INITIAL_BOARD_WIDTH,
  INITIAL_TARGET_CELL,
  MAX_ANIMATION_SPEED,
  MIN_ANIMATION_SPEED,
} from "./util/constraints";
import {
  BinaryTreeMazeGeneration,
  DFSMazeGeneration,
  KruskalMazeGeneration,
} from "./maze-generation/maze-generation";

import { useState, useEffect } from "react";
import { DijkstraAlgorithm } from "./maze-solvers/maze-solvers";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  // Media queries.
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  // Board dimensions.
  const [selectedBoardHeight, setSelectedBoardHeight] =
    useState(INITIAL_BOARD_HEIGHT);
  const [selectedBoardWidth, setSelectedBoardWidth] =
    useState(INITIAL_BOARD_WIDTH);

  // Animation speed.
  const [animationSpeed, setAnimationSpeed] = useState(INITIAL_ANIMATION_SPEED);

  // Tools.
  const [selectedTool, setSelectedTool] = useState("CHOOSE_SOURCE");
  const [visualizeAnimation, setVisualizeAnimation] = useState(true);

  const [selectedAMazeGenerationAlgo, setSelectedAMazeGenerationAlgo] =
    useState("DFS_ALGORITHM");

  // Board.
  const [board, setBoard] = useState(
    getEmptyBoard(selectedBoardWidth, selectedBoardHeight)
  );
  const [startingCell, setStartingCell] = useState({
    row: 0,
    col: 0,
  });
  const [targetCell, setTargetCell] = useState({
    row: selectedBoardHeight - 1,
    col: selectedBoardWidth - 1,
  });

  // Animation state management.
  const [generatingMaze, setGeneratingMaze] = useState(false);
  const [solvingMaze, setSolvingMaze] = useState(false);

  const [algortihmSteps, setAlgortihmSteps] = useState([]);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0);
  const [currentCell, setCurrentCell] = useState(null);

  const generateMaze = () => {
    if (generatingMaze) {
      setGeneratingMaze(false);
    } else {
      // Resetting board.
      setBoard(getEmptyBoard(selectedBoardWidth, selectedBoardHeight));

      // Getting algorithm steps and final state of board.
      let [steps, finalBoard] = [[], []];
      switch (selectedAMazeGenerationAlgo) {
        case "DFS_ALGORITHM":
          [steps, finalBoard] = DFSMazeGeneration(
            getEmptyBoard(selectedBoardWidth, selectedBoardHeight),
            0,
            0
          );
          break;
        case "BINARY_TREE_ALGORITHM":
          [steps, finalBoard] = BinaryTreeMazeGeneration(
            getEmptyBoard(selectedBoardWidth, selectedBoardHeight)
          );
          break;
        case "KRUSKAL_ALGORITHM":
          [steps, finalBoard] = KruskalMazeGeneration(
            getEmptyBoard(selectedBoardWidth, selectedBoardHeight)
          );
          break;
      }

      if (visualizeAnimation) {
        // Preparing to show animation.
        setGeneratingMaze(true);
        setCurrentAlgorithmStep(0);
        setAlgortihmSteps(steps);
        setCurrentCell(null);
      } else {
        // Setting the new board with the generate maze.
        setBoard(finalBoard);
      }
    }
  };

  const solveMaze = () => {
    if (solvingMaze) {
      setSolvingMaze(false);
    } else {
      const steps = DijkstraAlgorithm(board, startingCell, targetCell);
      // Preparing to show animation.
      setBoard((prevBoard) => {
        unvisitAllCells(prevBoard);
        return prevBoard;
      });
      setSolvingMaze(true);
      setCurrentAlgorithmStep(0);
      setAlgortihmSteps(steps);
      setCurrentCell(null);
    }
  };

  const handleClickedCell = (row, col) => {
    if (isSmallScreen) return;
    if (selectedTool === "CHOOSE_SOURCE") {
      if (row !== targetCell.row || col !== targetCell.col) {
        setStartingCell({
          row,
          col,
        });
      }
    } else {
      if (startingCell.row !== row || startingCell.col !== col) {
        setTargetCell({
          row,
          col,
        });
      }
    }
  };

  const changeAnimationSpeed = (event, selectedSpeed) => {
    if (typeof selectedSpeed === "number") setAnimationSpeed(selectedSpeed);
  };

  const changeBoardHeight = (event, newHeight) => {
    if (typeof newHeight === "number") {
      setSelectedBoardHeight(newHeight);
      setBoard(getEmptyBoard(selectedBoardWidth, newHeight));
      setStartingCell({
        row: 0,
        col: 0,
      });
      setTargetCell({
        row: newHeight - 1,
        col: selectedBoardWidth - 1,
      });
    }
  };

  const changeBoardWidth = (event, newWidth) => {
    if (typeof newWidth === "number") {
      setSelectedBoardWidth(newWidth);
      setBoard(getEmptyBoard(newWidth, selectedBoardHeight));
      setStartingCell({
        row: 0,
        col: 0,
      });
      setTargetCell({
        row: selectedBoardHeight - 1,
        col: newWidth - 1,
      });
    }
  };

  const changeSelectedTool = (event) => {
    setSelectedTool(event.target.value);
  };

  const changeSelectedManzeGenerationAlgorithm = (event) => {
    setSelectedAMazeGenerationAlgo(event.target.value);
  };

  const toggleVisualizeAnimation = (event) => {
    setVisualizeAnimation(event.target.checked);
  };

  useEffect(() => {
    if (!generatingMaze && !solvingMaze) return;
    setTimeout(() => {
      if (solvingMaze) {
        animateDijkstraAlgorithm(currentAlgorithmStep);
      } else {
        switch (selectedAMazeGenerationAlgo) {
          case "DFS_ALGORITHM":
            animateDFSMazeGeneration(currentAlgorithmStep);
            break;
          case "BINARY_TREE_ALGORITHM":
            animateBinaryTreeAlgorithm(currentAlgorithmStep);
            break;
          case "KRUSKAL_ALGORITHM":
            animateKruskalAlgorithm(currentAlgorithmStep);
            break;
        }
      }

      if (currentAlgorithmStep < algortihmSteps.length) {
        setCurrentAlgorithmStep((prevStep) => {
          return Math.min(prevStep + 1, algortihmSteps.length - 1);
        });
      }

      if (currentAlgorithmStep === algortihmSteps.length - 1) {
        if (generatingMaze) {
          setGeneratingMaze(false);
          setBoard((prevBoard) => {
            unvisitAllCells(prevBoard);
            return prevBoard;
          });
        } else {
          setSolvingMaze(false);
        }
      }
    }, animationSpeed);

    return () => {};
  }, [
    generatingMaze,
    solvingMaze,
    algortihmSteps,
    currentAlgorithmStep,
    animationSpeed,
  ]);

  const animateDFSMazeGeneration = (currentStep) => {
    const { action, row, col, wall } = algortihmSteps[currentStep];
    switch (action) {
      case "VISIT_CELL":
        setBoard((prevBoard) => {
          if (currentCell)
            prevBoard[currentCell.row][currentCell.col].state = "visited";
          prevBoard[row][col].state = "processing";
          return prevBoard;
        });
        setCurrentCell({
          row,
          col,
        });
        break;
      case "CARVE_WALL":
        setBoard((prevBoard) => {
          carveWall(prevBoard, wall, currentCell.row, currentCell.col);
          return prevBoard;
        });
        break;
    }
  };

  const animateBinaryTreeAlgorithm = (currentStep) => {
    const { action, row, col, wall } = algortihmSteps[currentStep];
    switch (action) {
      case "VISIT_CELL":
        setBoard((prevBoard) => {
          if (currentCell)
            prevBoard[currentCell.row][currentCell.col].state = "visited";
          prevBoard[row][col].state = "processing";
          return prevBoard;
        });
        setCurrentCell({
          row,
          col,
        });
        break;
      case "CARVE_WALL":
        setBoard((prevBoard) => {
          carveWall(prevBoard, wall, currentCell.row, currentCell.col);
          return prevBoard;
        });
        break;
    }
  };

  const animateKruskalAlgorithm = (currentStep) => {
    const { action, row, col, wall } = algortihmSteps[currentStep];
    switch (action) {
      case "VISIT_CELL":
        setBoard((prevBoard) => {
          if (currentCell)
            prevBoard[currentCell.row][currentCell.col].state = "visited";
          prevBoard[row][col].state = "processing";
          return prevBoard;
        });
        setCurrentCell({
          row,
          col,
        });
        break;
      case "CARVE_WALL":
        setBoard((prevBoard) => {
          carveWall(prevBoard, wall, currentCell.row, currentCell.col);
          return prevBoard;
        });
        break;
    }
  };

  const animateDijkstraAlgorithm = (currentStep) => {
    const { action, row, col, direction } = algortihmSteps[currentStep];
    console.log(direction);
    switch (action) {
      case "VISIT_CELL":
        setBoard((prevBoard) => {
          if (currentCell)
            prevBoard[currentCell.row][currentCell.col].state = "visited";
          prevBoard[row][col].state = "processing";
          return prevBoard;
        });
        setCurrentCell({
          row,
          col,
        });
        break;
      case "ENQUEUE":
        setBoard((prevBoard) => {
          prevBoard[row][col].state = "enqueued";
          return prevBoard;
        });
        break;
      case "MAKE_PART_OF_PATH":
        setBoard((prevBoard) => {
          prevBoard[row][col].state = "part__of__path";
          prevBoard[row][col].direction = direction;
          return prevBoard;
        });
        break;
    }
  };

  if (isSmallScreen) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Stack spacing={2} justifyContent="center" height="100%">
          <Card>
            <CardContent>
              <Stack justifyContent="center" direction="row">
                <a
                  href="https://github.com/diegoZarateFer/a-MAZE-me"
                  target="_blank"
                >
                  <RxGithubLogo size={30} color="white" />
                </a>
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Board
                  onCellClick={handleClickedCell}
                  startingCell={startingCell}
                  targetCell={targetCell}
                  matrix={board}
                />
              </Stack>
            </CardContent>
          </Card>
          <Stack spacing={2} justifyContent="center">
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  TOOLS
                </Typography>
                <Stack spacing={1} justifyContent="center">
                  <InputLabel id="pathfinding-algo-select">
                    Maze Generation Algorithm
                  </InputLabel>

                  <Select
                    label="Maze Generation Algorithm"
                    value={selectedAMazeGenerationAlgo}
                    onChange={changeSelectedManzeGenerationAlgorithm}
                    disabled={solvingMaze || generatingMaze}
                  >
                    <MenuItem value={"DFS_ALGORITHM"}>DFS Algorithm</MenuItem>
                    <MenuItem value={"BINARY_TREE_ALGORITHM"}>
                      Binary Tree Algorithm
                    </MenuItem>
                    <MenuItem value={"KRUSKAL_ALGORITHM"}>
                      Randomized Kruskal
                    </MenuItem>
                  </Select>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <FormGroup>
                      <FormControlLabel
                        checked={visualizeAnimation}
                        onChange={toggleVisualizeAnimation}
                        control={
                          <Checkbox disabled={solvingMaze || generatingMaze} />
                        }
                        label="Visualize animation"
                      />
                    </FormGroup>
                  </Stack>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    {generatingMaze && (
                      <Button
                        disabled={solvingMaze}
                        onClick={generateMaze}
                        variant="contained"
                        size="small"
                        color="error"
                      >
                        Stop
                      </Button>
                    )}

                    {!generatingMaze && (
                      <Button
                        disabled={solvingMaze}
                        onClick={generateMaze}
                        variant="contained"
                        size="small"
                      >
                        Generate Maze
                      </Button>
                    )}

                    {solvingMaze && (
                      <Button
                        disabled={generatingMaze}
                        variant="contained"
                        size="small"
                        onClick={solveMaze}
                        color="error"
                      >
                        Stop
                      </Button>
                    )}

                    {!solvingMaze && (
                      <Button
                        disabled={generatingMaze}
                        variant="contained"
                        size="small"
                        onClick={solveMaze}
                      >
                        Solve!
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={1} justifyContent="left" direction="row">
                    <ChevronRightIcon />
                    <Typography>Starting Cell</Typography>
                  </Stack>
                  <Stack spacing={1} justifyContent="left" direction="row">
                    <GpsFixedIcon />
                    <Typography>Target Cell</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={2} justifyContent="center" direction="row" height="100%">
        <Stack spacing={2} justifyContent="center">
          <Card>
            <CardContent>
              <Stack justifyContent="center" direction="row">
                <a
                  href="https://github.com/diegoZarateFer/a-MAZE-me"
                  target="_blank"
                >
                  <RxGithubLogo size={30} color="white" />
                </a>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                TOOLS
              </Typography>
              <Stack spacing={1} justifyContent="center">
                <Typography id="animation-speed-slider" gutterBottom>
                  Choose Animation Speed:
                </Typography>
                <Slider
                  size="small"
                  min={MIN_ANIMATION_SPEED}
                  max={MAX_ANIMATION_SPEED}
                  step={1}
                  value={animationSpeed}
                  aria-labelledby="animation-speed-slider"
                  disabled={solvingMaze || generatingMaze}
                  valueLabelDisplay="auto"
                  onChange={changeAnimationSpeed}
                />

                <Typography id="board-height-slider" gutterBottom>
                  Height:
                </Typography>

                <Slider
                  size="small"
                  min={2}
                  max={25}
                  step={1}
                  value={selectedBoardHeight}
                  aria-labelledby="board-height-slider"
                  valueLabelDisplay="auto"
                  disabled={solvingMaze || generatingMaze}
                  onChange={changeBoardHeight}
                />

                <Typography id="board-width-slider" gutterBottom>
                  Width:
                </Typography>

                <Slider
                  size="small"
                  disabled={solvingMaze || generatingMaze}
                  min={2}
                  max={40}
                  step={1}
                  value={selectedBoardWidth}
                  aria-labelledby="board-width-slider"
                  valueLabelDisplay="auto"
                  onChange={changeBoardWidth}
                />

                <Stack spacing={1} justifyContent="center" direction="row">
                  <RadioGroup
                    onChange={changeSelectedTool}
                    value={selectedTool}
                  >
                    <FormControlLabel
                      value="CHOOSE_SOURCE"
                      control={
                        <Radio disabled={solvingMaze || generatingMaze} />
                      }
                      label="Choose starting cell"
                    />
                    <FormControlLabel
                      value="CHOOSE_TARGET"
                      control={
                        <Radio disabled={solvingMaze || generatingMaze} />
                      }
                      label="Choose target cell"
                    />
                  </RadioGroup>
                </Stack>

                <InputLabel id="pathfinding-algo-select">
                  Maze Generation Algorithm
                </InputLabel>

                <Select
                  label="Maze Generation Algorithm"
                  value={selectedAMazeGenerationAlgo}
                  onChange={changeSelectedManzeGenerationAlgorithm}
                  disabled={solvingMaze || generatingMaze}
                >
                  <MenuItem value={"DFS_ALGORITHM"}>DFS Algorithm</MenuItem>
                  <MenuItem value={"BINARY_TREE_ALGORITHM"}>
                    Binary Tree Algorithm
                  </MenuItem>
                  <MenuItem value={"KRUSKAL_ALGORITHM"}>
                    Randomized Kruskal
                  </MenuItem>
                </Select>

                <Stack direction="row" spacing={1} justifyContent="center">
                  <FormGroup>
                    <FormControlLabel
                      checked={visualizeAnimation}
                      onChange={toggleVisualizeAnimation}
                      control={
                        <Checkbox disabled={solvingMaze || generatingMaze} />
                      }
                      label="Visualize animation"
                    />
                  </FormGroup>
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="center">
                  {generatingMaze && (
                    <Button
                      disabled={solvingMaze}
                      onClick={generateMaze}
                      variant="contained"
                      size="small"
                      color="error"
                    >
                      Stop
                    </Button>
                  )}

                  {!generatingMaze && (
                    <Button
                      disabled={solvingMaze}
                      onClick={generateMaze}
                      variant="contained"
                      size="small"
                    >
                      Generate Maze
                    </Button>
                  )}

                  {solvingMaze && (
                    <Button
                      disabled={generatingMaze}
                      variant="contained"
                      size="small"
                      onClick={solveMaze}
                      color="error"
                    >
                      Stop
                    </Button>
                  )}

                  {!solvingMaze && (
                    <Button
                      disabled={generatingMaze}
                      variant="contained"
                      size="small"
                      onClick={solveMaze}
                    >
                      Solve!
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack spacing={1} justifyContent="left" direction="row">
                  <ChevronRightIcon />
                  <Typography>Starting Cell</Typography>
                </Stack>
                <Stack spacing={1} justifyContent="left" direction="row">
                  <GpsFixedIcon />
                  <Typography>Target Cell</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "90vh", width: "70vw" }}
            >
              <Board
                onCellClick={handleClickedCell}
                startingCell={startingCell}
                targetCell={targetCell}
                matrix={board}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
