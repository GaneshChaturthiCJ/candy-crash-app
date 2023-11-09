import React, { useState, useRef, useEffect } from "react";
import Candy from "./Candy";

let intervalId;
let message;
let target = Math.floor(Math.random() * 21) + 200;

const colors = ["red", "blue", "green"]; // Add more colors as needed

localStorage.setItem("candyCrashHighScore", 0);

const Game = () => {
  const [grid, setGrid] = useState(generateGrid());
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(60);
  const [statusMsg, setStatusMsg] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(intervalId);
        setStatusMsg(true);
      } else {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (score > target) {
    message = "You Win!✌️";
  } else {
    message = "You Lose!😶‍🌫️";
  }

  //restart game
  const handleRestartClick = () => {
    setScore(0);
    setTimeLeft(60);
    setStatusMsg(false);
    setGrid(generateGrid());
  };

  //update highscore
  if (score > localStorage.getItem("candyCrashHighScore")) {
    localStorage.setItem("candyCrashHighScore", score);
  }

  //To play game sound
  const audioRef = useRef(null);
  const playSound = () => {
    audioRef.current.play();
  };

  //To generate candy board
  function generateGrid() {
    const newGrid = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        let num = Math.floor(Math.random() * colors.length);
        const randomColor = colors[num];
        //console.log(num)
        row.push({ color: randomColor });
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  function burstCandies(row, col, color) {
    if (
      row < 0 ||
      row >= 10 ||
      col < 0 ||
      col >= 10 ||
      grid[row][col].color !== color
    ) {
      return; // Stop if out of bounds or different color
    }

    // Mark the current candy as burst (you can also set it to null or another value to indicate it's burst)
    grid[row][col].color = null;
    setScore((p) => p + 1);

    // Check the neighboring candies
    burstCandies(row + 1, col, color); // Check down
    burstCandies(row - 1, col, color); // Check up
    burstCandies(row, col + 1, color); // Check right
    burstCandies(row, col - 1, color); // Check left
  }

  function handleClick(row, col) {
    const color = grid[row][col].color;
    if (color) {
      const newGrid = [...grid];
      burstCandies(row, col, color);

      // Filter out burst candies by removing candies with a null color
      for (let i = 0; i < 10; i++) {
        newGrid[i] = newGrid[i].filter((candy) => candy.color !== null);
      }

      // Fill in the removed candies at the top with new random candies
      for (let i = 0; i < 10; i++) {
        while (newGrid[i].length < 10) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          newGrid[i].unshift({ color: randomColor });
        }
      }

      // Now, update the grid to reflect the changes
      setGrid(newGrid);
    }
  }

  return (
    <div>
      <h1>Candy Matching Game(Target:{target} )</h1>
      <h1>High Score: {localStorage.getItem("candyCrashHighScore")}</h1>
      <h1>Score: {score}</h1>

      <div className="timer">Time Remaining: {timeLeft}</div>
      {statusMsg ? <h1>{message}</h1> : ""}

      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((candy, colIndex) => (
              <Candy
                key={colIndex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                color={candy.color}
                onClick={() => {
                  handleClick(rowIndex, colIndex);
                  playSound();
                }}
              />
            ))}
          </div>
        ))}

        <audio ref={audioRef}>
          <source
            src="https://vgmsite.com/soundtracks/candy-crush-soda/xifcqmft/Memories%20Attempts%20Popup.mp3"
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
      </div>

      <button className="restart" onClick={handleRestartClick}>
        Restart Game
      </button>
    </div>
  );
};

export default Game;
