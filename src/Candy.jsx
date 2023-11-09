import React from "react";
import "./Candy.css";

const Candy = ({ color, onClick, rowIndex, colIndex }) => {
  return <div className={`candy ${color}`} onClick={onClick}></div>;
};

export default Candy;
