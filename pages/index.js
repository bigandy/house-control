import { useState } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
	const [lightsOn, setLightsOn] = useState(false);
	const toggleLight = async () => {
		setLightsOn((prevState) => !prevState);

		// handle light change. Trigger via api
		await fetch("/api/toggle-lights?newState=" + !lightsOn)
			.then((res) => res.json())
			.then((json) => console.log(json))
			.catch((e) => console.error(e));
	};
	return (
		<div
			className={styles.container}
			style={{ backgroundColor: lightsOn ? "white" : "black" }}
		>
			<button onClick={toggleLight}>
				Turn Lights {lightsOn ? "Off" : "On"}
			</button>
		</div>
	);
}
