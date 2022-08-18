import { useState } from "react";

export default function Tip(props) {
	const [animationName, setAnimationName] = useState("float-up");

	async function dissapear() {
		setAnimationName("dissapear");
		await new Promise(r => setTimeout(r, 500));
		props.hideTip();
	}

	return (
		<div className="tip" style={ {animationName: animationName} } onClick={dissapear}>
			<img 
				src="arrow-up-short.svg" 
				alt="arrow up" 
				className="tip-arrow"
			/>
			<div className="tip-text">
				<img 
					src="info-circle-fill.svg" 
					alt="info circle" 
				/>
				<p>{props.text}</p>
			</div>
		</div>
	)
}
