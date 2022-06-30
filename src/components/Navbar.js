import {useState} from "react";

export default function Navbar(props) {
	const [hover, setHover] = useState(false);

	const colors = ["#222222", "deepskyblue", "deeppink"];

	const toggleHover = () => {
		setHover(prevHover => !prevHover);
	}

	const styles = {
		backgroundColor: props.win ? colors[props.player + 1] : colors[0],
		transition: "1s"
	}

	const resetStyle = {
		right: hover ? "40px" : "-200px",
		transform: hover ? "rotate(160deg)" : "rotate(-20deg)",
		transition: "0.6s",
		opacity: props.win ? "0.9" : "0.2"
	}

	return (
		<nav 
			onMouseEnter={toggleHover}
			onMouseLeave={toggleHover}
			onClick={props.reset} 
			style={styles}
		>
			<img className="nav--image" src="logo.svg" alt="logo" />
			<h1>Tic-Tac-Toe</h1>
			<img 
				className="nav--reset" 
				style={resetStyle} 
				src="refresh.svg" alt="refresh"
			/>
		</nav>
	)
}
