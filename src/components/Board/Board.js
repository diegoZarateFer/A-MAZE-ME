import classes from "./Board.module.css";

import Cell from "./Cell";

const Board = (props) => {
  const { matrix, startingCell, targetCell } = props;

  return (
    <table className={classes.table}>
      <tbody className={classes.tbody}>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((col, colIndex) => (
              <Cell
                direction="LEFT"
                isTargetCell={
                  rowIndex === targetCell.row && colIndex === targetCell.col
                }
                isStartingCell={
                  rowIndex === startingCell.row && colIndex === startingCell.col
                }
                onClick={props.onCellClick.bind(null, rowIndex, colIndex)}
                key={`${rowIndex} ${colIndex}`}
                cell={col}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
