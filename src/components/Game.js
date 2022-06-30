import {useEffect} from "react";
import Square from "./Square";

export default function Game(props) {
	const width = props.width;
	const height = props.height;
	const squareNo = props.squareNo;

	const winningLength = props.winningLength;

	const gameState = props.gameState;
	const setGameState = props.setGameState;
	const GAME_STATES = props.GAME_STATES;

	const values = props.values;
	const setValues = props.setValues;

	const noOfPlayers = props.noOfPlayers;
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

	function getEmptyIndexes(field) {
		const arr = [];

		for (let i = 0; i < field.length; i++) {
			if (field[i] === 0) {
				arr.push(i);
			}
		}

		return arr;
	}

	function winning(field, player) {
		let win = false;
		let index = 0;

		while (index < field.length && !win) {

			if (field[index] === player && checkSquares(index, field).length >= winningLength) {
				win = true;
			} else {
				index++;
			}
		}

		return win;
	}

	function minimax(field, player, loop, index) {
		let empty = getEmptyIndexes(field);

		loop++;

		if (empty.length === 0 || loop > 4) {
			const length = checkSquares(index, field).length;

			if (player === 1) {
				return {score: length};

			} else {
				return {score: -length};
			}

		} else if (winning(field, 1)) {
			return {score: -20 + loop};

		} else if (winning(field, 2)) {
			return {score: 20 - loop};
		} 

		const moves = [];

		// loop through available spots
		for (let i = 0; i < empty.length; i++){
			//create an object for each and store the index of that spot 
			let move = {};
			move.index = empty[i];

			// set the empty spt to the current player
			field[empty[i]] = player;

			/*collect the score resulted from calling minimax 
			on the opponent of the current player*/
			if (player === 2) {
				let result = minimax(field, 1, loop, move.index);
				move.score = result.score;

			} else {
				let result = minimax(field, 2, loop, move.index);
				move.score = result.score;
			}

			// reset the spot to empty
			field[empty[i]] = 0;

			// push the object to the array
			moves.push(move);
		}

		// if it is the computer's turn loop over the moves and choose the move with the highest score
		let bestMoves = [];

		if (player === 2) {
			let bestScore = -10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMoves = [i];
				} else if (moves[i].score === bestScore) {
					bestMoves.push(i);
				}
			}
		} else {

			// else loop over the moves and choose the move with the lowest score
			let bestScore = 10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMoves = [i];
				} else if (moves[i].score === bestScore) {
					bestMoves.push(i);
				}
			}
		}

		return moves[bestMoves[Math.floor(bestMoves.length * Math.random())]];
	}

	useEffect(() => {
		if (noOfPlayers === 1 && currentPlayer === 1) {

			let index = minimax([...values], 2, 0);

			handleClick(index.index);
		}
	}, [currentPlayer, noOfPlayers]);

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

		if (gameState === GAME_STATES.PLAYING) {
			if (values[id] === 0) {
				setValues(prevValues => {
					prevValues[id] = currentPlayer + 1;

					if (checkWin(id, values)) {
						win();
						retVal = true;
					} else if (checkDraw(values)) {
						draw();
					} else {
						nextPlayer();
					}

					return prevValues;
				});
			}
		} else {

		}

		return retVal;
	}

	/**
	 * Check if the game has ended as a draw
	 */
	function checkDraw(field) {
		return field.filter(value => value === 0).length === 0;
	}

	/**
	 * Change game state to draw
	 */
	function draw() {
		setGameState(GAME_STATES.DRAW);
	}

	/**
	 * Change game state to win
	 */
	function win() {
		setGameState(GAME_STATES.WIN);	
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

		const checkedSquares = checkSquares(id, values);

		if (checkedSquares.length >= winningLength) {
			setWinningSquares(checkedSquares);
			retVal = true;	
		}

		return retVal;
	}

	/**
	 * Returns longest array of squares in line from the id
	 */
	function checkSquares(id, field) {
		const neighbours = getNeighbours(id);
		let returnArr = [];

		for (let i = 0; i < neighbours.length; i++) {
			if (field[id] === field[neighbours[i]]) {
				let offset = neighbours[i] - id;
				let arr = [id]

				arr = arr.concat(getLength(id, offset, field));

				if (neighbours.includes(id - offset)) {
					arr = arr.concat(getLength(id, -offset, field));
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
	function getLength(id, offset, field) {
		let neighbour = id + offset;
		let value = field[id]
		let currentId = id;
		const arr = [];

		while (arr.length < winningLength 
			&& field[neighbour] === value 
			&& getNeighbours(currentId).includes(neighbour)) {

			currentId = neighbour;

			arr.push(currentId);

			neighbour = neighbour + offset;

			if (neighbour < 0 || neighbour >= field.length) {
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
		if (gameState === GAME_STATES.WIN) {
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
					end={gameState === GAME_STATES.WIN}
					currentPlayer={currentPlayer}
					symbol={values[i]}
					playerSymbols={playerSymbols}
					handleClick={() => handleClick(i, values)}
					delay={winningSquares.includes(i) ? delay[winningSquares.indexOf(i)] : 0}
					noOfPlayers={noOfPlayers}
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
			case GAME_STATES.PLAYING:
				return "Current player: " + playerSymbols[currentPlayer];
			case GAME_STATES.WIN:
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
