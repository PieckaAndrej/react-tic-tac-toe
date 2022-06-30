import {useEffect, useRef, useState} from "react";

export default function Settings(props) {
	const [animation, setAnimation] = useState(props.settings.show ? "show" : "hide")
	const ref = useRef();

	function generateButtons(texts, values, setting, selected) {
		const arr = [];
		for (let i = 0; i < texts.length; i++) {
			arr.push(<button
				onClick={() => props.handleSettings(setting, values[i])}
				style={i === selected ? {border: "5px solid deepskyblue"} : {}}
				key={i}
			>
				{texts[i]}</button>
			);
		}

		return arr;
	}

	function hide(ms) {
		setAnimation("hide");
		props.hideSettings(ms);
	}

	useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (animation === "show" && ref.current && !ref.current.contains(e.target)) {
        hide(300)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [animation])

	return (
		<div className="settings"
			ref={ref}
			style={ {animationName: animation, 
			opacity: animation === "show" ? "1" : "0" } }
		>
			<button 
				className="settings--close"
				onClick={() => hide(300)}
			>Close X</button>

			<h1 className="settings--title">Settings</h1>
			<div className="settings--content">
				<h2 className="settings--section">Players:</h2>
				{generateButtons(["Solo", "Double"], [0, 1], ["players"], props.settings.players)}
				<h2 className="settings--section">Field:</h2>
				{generateButtons(["3x3", "5x5"], [3, 5], ["width", "height"], props.settings.width === 3 ? 0 : 1)}
			</div>
		</div>
	)
}

