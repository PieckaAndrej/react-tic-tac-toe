import React from "react";
import Square from "./Square";

export default function Game(props) {
	const width = props.width;
	const height = props.height;
	const squareNo = props.squareNo;

	const winningLength = 4;

	const gameState = props.gameState;
	const setGameState = props.setGameState;
	const gameStates = props.gameStates;

	const values = props.values;
	const setValues = props.setValues;

	const currentPlayer = props.currentPlayer;
	const setCurrentPlayer = props.setCurrentPlayer;

	const playerSymbols = props.playerSymbols;

	const winningSquares = props.winningSquares;
	const setWinningSquares = props.setWinningSquares;

	/**
	 * Styles for the squares
	 */
	const styles = {
		gridTemplateRows: getGridTemplateStyle(height),
		gridTemplateColumns: getGridTemplateStyle(width)
	}

	/**
	 * Get grid template sytle for the squares with amount
	 * One square has 70px
	 */
	function getGridTemplateStyle(amount) {
		let style = "";

		for (let i = 0; i < amount; i++) {
			style += " 70px"
		}

		return style;
	}

	/**
	 * Function that is called when a square is clicked
	 */
	function handleClick(id) {
		let retVal = false;

		if (gameState === gameStates.Playing) {
			if (values[id] === 0) {
				setValues(prevValues => {
					prevValues[id] = currentPlayer + 1;

					if (checkWin(id)) {
						win();
						retVal = true;
					} else if (checkDraw()) {
						draw();
					} else {
						nextPlayer();
					}

					return prevValues;
				});

			}

		}

		return retVal;
	}

	/**
	 * Check if the game has ended as a draw
	 */
	function checkDraw() {
		return values.filter(value => value === 0).length === 0;
	}

	/**
	 * Change game state to draw
	 */
	function draw() {
		setGameState(gameStates.Draw);
	}

	/**
	 * Change game state to win
	 */
	function win() {
		setGameState(gameStates.Win);	
	}

	/**
	 * Get x coordinate from the id
	 */
	function getX(id) {
		return id % width;
	}

	/**
	 * Get Y coordinate from the id
	 */
	function getY(id) {
		return Math.floor(id / width);
	}

	/**
	 * Get square id from the coordinates
	 */
	function getSquareId(x, y) {
		return (y * width) + x;
	}

	/**
	 * Check if the cooridnates are outside of the field
	 */
	function checkBounds(x, y) {
		return x >= 0 && y >= 0 && x < width && y < height;
	}

	/**
	 * Get neighbours of the id
	 */
	function getNeighbours(id) {
		const returnArr = [];
		const checkArr = [-1, 0, 1];

		for (let x = 0; x < checkArr.length; x++) {
			for (let y = 0; y < checkArr.length; y++) {
				let currentX = getX(id) + checkArr[x];
				let currentY = getY(id) + checkArr[y];

				if (checkBounds(currentX, currentY)) {
					returnArr.push(getSquareId(currentX, currentY))
				}
			}
		}

		// Remove id that has the neighbours
		return returnArr.filter(currentId => currentId !== id);
	}

	/**
	 * Check if the clicked id made the player win
	 */
	function checkWin(id) {
		let retVal = false;

		const checkedSquares = checkSquares(id);

		if (checkedSquares.length >= winningLength) {
			setWinningSquares(checkedSquares);
			retVal = true;	
		}

		return retVal;
	}

	/**
	 * Returns longest array of squares in line from the id
	 */
	function checkSquares(id) {
		const neighbours = getNeighbours(id);
		let returnArr = [];

		for (let i = 0; i < neighbours.length; i++) {
			if (values[id] === values[neighbours[i]]) {
				let offset = neighbours[i] - id;
				let arr = [id]

				arr = arr.concat(getLength(id, offset));

				if (neighbours.includes(id - offset)) {
					arr = arr.concat(getLength(id, -offset));
				}

				if (arr.length > returnArr.length) {
					returnArr = arr;
				}
			}
		}

		return returnArr;
	}

	/**
	 * Get length from the id with the offset
	 */
	function getLength(id, offset) {
		let neighbour = id + offset;
		let value = values[id]
		let currentId = id;
		const arr = [];

		while (arr.length < winningLength 
			&& values[neighbour] === value 
			&& getNeighbours(currentId).includes(neighbour)) {

			currentId = neighbour;

			arr.push(currentId);

			neighbour = neighbour + offset;

			if (neighbour < 0 || neighbour >= values.length) {
				value = 0;
			}

		}

		return arr;
	}

	/**
	 * Change to next player
	 */
	function nextPlayer() {
		setCurrentPlayer(prevCurrentPlayer => {
			return ++prevCurrentPlayer % 2;
		});
	};

	/**
	 * Get length of a vector
	 */
	function getVectorLength(x, y) {
		return Math.sqrt(x*x + y*y);
	}

	/**
	 * Generate squares for the field
	 */
	function getSquares() {
		let arr = [];
		let delay = []

		// Delay for the animation
		if (gameState === gameStates.Win) {
			for (let i = 0; i < winningSquares.length; i++) {
				let x = getX(winningSquares[i]);
				let y = getY(winningSquares[i]);

				delay.push(getVectorLength(
					getX(winningSquares[0]) - x, getY(winningSquares[0]) - y) * 0.3
				);
			}
		}

		for (let i = 0; i < squareNo; i++) {
			arr.push(
				<Square 
					key={i}
					win={winningSquares.includes(i)}
					currentPlayer={currentPlayer}
					symbol={values[i]}
					playerSymbols={playerSymbols}
					handleClick={() => handleClick(i)}
					delay={winningSquares.includes(i) ? delay[winningSquares.indexOf(i)] : 0}
				/>
			);
		}

		return arr;
	}

	/**
	 * Get text of the current state for the players
	 */
	function getStateText() {
		switch (gameState) {
			case gameStates.Playing:
				return "Current player: " + playerSymbols[currentPlayer];
			case gameStates.Win:
				return "Player " + playerSymbols[currentPlayer] + " won!";
			default:
				return "Draw";
		}
	}

	return (
		<div className="field">
			<div className="field--grid" style={styles}>
				{getSquares()}
			</div>
			<p className="field--state">{getStateText()}</p>
		</div>
	)
}
