import classes from "./Cell.module.css";

import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { FaArrowDown } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

const Cell = (props) => {
  const handleClick = (cellInfo) => {
    props.onClick();
  };

  const { isStartingCell, isTargetCell } = props;
  const { rightWall, leftWall, bottomWall, topWall, state, direction } =
    props.cell;

  return (
    <td
      onClick={handleClick.bind(null)}
      className={`${classes.cell} ${
        rightWall
          ? classes["cell__right__wall"]
          : classes["cell__right__wall__hidden"]
      }  ${
        topWall
          ? classes["cell__top__wall"]
          : classes["cell__top__wall__hidden"]
      }  ${
        leftWall
          ? classes["cell__left__wall"]
          : classes["cell__left__wall__hidden"]
      } ${
        bottomWall
          ? classes["cell__bottom__wall"]
          : classes["cell__bottom__wall__hidden"]
      }`}
    >
      <div className={`${classes[state]} ${classes["cell__content"]}`}>
        {isStartingCell ? (
          <ChevronRightIcon />
        ) : isTargetCell ? (
          <GpsFixedIcon fontSize="small" />
        ) : direction === "UP" ? (
          <FaArrowUp fontSize="small" />
        ) : direction === "DOWN" ? (
          <FaArrowDown fontSize="small" />
        ) : direction === "LEFT" ? (
          <FaArrowLeft fontSize="small" />
        ) : direction === "RIGHT" ? (
          <FaArrowRight fontSize="small" />
        ) : null}
      </div>
    </td>
  );
};

export default Cell;
