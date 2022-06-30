import "./App.css";
import Navbar from "./components/Navbar";
import Game from "./components/Game";
import {useEffect, useState} from "react";
import Settings from "./components/Settings";

function App() {

	const GAME_STATES = {
		PLAYING: "playing",
		DRAW: "draw",
		WIN: "win"
	}

	const playerSymbols = ["X", "O"];

	// Settings States
	const [settings, setSettings] = useState(
		JSON.parse(localStorage.getItem("settings")) ||
		{
			show: true,
			players: 0,
			width: 5,
			height: 5,
		}
	);

	const squareNo = settings.width * settings.height;
	const winningLength = settings.width === 3 ? 3 : 4;

	//Game States
	const [winningSquares, setWinningSquares] = useState([]);
	const [values, setValues] = useState(getStartingValues());
	const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
	const [currentPlayer, setCurrentPlayer] = useState(0);


	function handleSettings(name, value) {
		name.forEach(n => {
			setSettings(prevSettings => ({
				...prevSettings,
				[n]: value
			}))
		})
	}

	useEffect(() => {
		localStorage.setItem("settings", JSON.stringify(settings));
	}, [settings])

	function getStartingValues() {
		let arr = [];

		for (let i = 0; i < squareNo; i++) {
			arr.push(0);
		}

		return arr;
	}

	useEffect(() => {
		reset();
	}, [winningLength]);

	function reset() {
		setWinningSquares([]);
		setValues(getStartingValues());
		setGameState(GAME_STATES.PLAYING);
		setCurrentPlayer(0);
	}

	async function hideSettings(ms) {
		await new Promise(r => setTimeout(r, ms));
		handleSettings(["show"], false)
	}

	return (
		<div className="App">
			<Navbar 
				reset={reset}
				player={currentPlayer}
				win={GAME_STATES.WIN === gameState}
			/>
			<Game 
				width={settings.width}
				height={settings.height}
				squareNo={squareNo}
				winningSquares={winningSquares}
				setWinningSquares={setWinningSquares}
				values={values}
				setValues={setValues}
				gameState={gameState}
				setGameState={setGameState}
				currentPlayer={currentPlayer}
				setCurrentPlayer={setCurrentPlayer}
				GAME_STATES={GAME_STATES}
				playerSymbols={playerSymbols}
				noOfPlayers={settings.players + 1}
				winningLength={winningLength}
			/>
			{
				settings.show ? ( 
					<Settings 
						settings={settings}
						handleSettings={handleSettings}
						hideSettings={hideSettings}
					/>) : (
						<img 
							className="settings--icon" 
							src="gear-fill.svg" 
							alt="settings" 
							onClick={() => handleSettings(["show"], true)}
						/>
					)
			}
		</div>
	);
}

export default App;
