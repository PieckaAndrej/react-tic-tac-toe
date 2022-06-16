import React from "react";

export default function Square(props) {
	const [hover, setHover] = React.useState(false);

	const colors = ["#666666", "deepskyblue", "deeppink"]

	/**
	 * Get color of the square depending on the currentPlayer
	 */
	function getColor() {
		if (props.symbol === 0) {
			return hover ? colors[props.currentPlayer + 1] : colors[0];
		} else {
			return colors[props.symbol];
		}
	}

	const toggleHover = function() {
		setHover(prevHover => !prevHover)
	}

	const styles = {
		color: [getColor()],
		borderColor: [getColor()],
		transition: "0.3s"
	}

	const winStyle = {
		color: "#111111",
		borderColor: [colors[props.symbol]],
		backgroundColor: [colors[props.symbol]],
		animationName: "flip",
		animationDuration: "0.8s",
		animationDelay: `${props.delay}s`, 
		animationTimingFunction: "linear",
		transitionDelay: `${props.delay + 0.4}s`
	}

	return (
		<div 
			style={props.win ? winStyle : styles} 
			className="square" 
			onClick={props.handleClick}
			onMouseEnter={toggleHover}
			onMouseLeave={toggleHover}
		>
			<p className="square--symbol">{
				props.symbol === 0 ? "" : props.playerSymbols[props.symbol - 1]
			}</p>
		</div>
	)
}
