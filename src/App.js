import React from "react";
import Navbar from "./components/Navbar";
import Game from "./components/Game";

function App() {
	const width = 5;
	const height = 5;
	const squareNo = width * height;

	const gameStates = {
		Playing: "playing",
		Draw: "draw",
		Win: "win"
	}

	const playerSymbols = ["X", "O"];

	const [winningSquares, setWinningSquares] = React.useState([]);

	const [values, setValues] = React.useState(getStartingValues());

	const [gameState, setGameState] = React.useState(gameStates.Playing);

	const [currentPlayer, setCurrentPlayer] = React.useState(0);


	function getStartingValues() {
		let arr = [];

		for (let i = 0; i < squareNo; i++) {
			arr.push(0);
		}

		return arr;
	}

	function reset() {
		setWinningSquares([]);
		setValues(getStartingValues());
		setGameState(gameStates.Playing);
		setCurrentPlayer(0);
	}

	return (
		<div className="App">
			<Navbar 
				reset={reset}
				player={currentPlayer}
				win={gameStates.Win === gameState}
			/>
			<Game 
				width={width}
				height={height}
				squareNo={squareNo}
				winningSquares={winningSquares}
				setWinningSquares={setWinningSquares}
				values={values}
				setValues={setValues}
				gameState={gameState}
				setGameState={setGameState}
				currentPlayer={currentPlayer}
				setCurrentPlayer={setCurrentPlayer}
				gameStates={gameStates}
				playerSymbols={playerSymbols}
			/>
		</div>
	);
}

export default App;
