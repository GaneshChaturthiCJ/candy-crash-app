import React from "react";
import "./Candy.css";

const Candy = ({ color, onClick, rowIndex, colIndex }) => {
  return (
    <div className={`candy ${color}`} onClick={onClick}>
      [{rowIndex},{colIndex}], {color.substring(0, 1).toUpperCase()}
    </div>
  );
};

export default Candy;
