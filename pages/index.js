import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
	const [room, setRoom] = useState("lounge");
	const [musicPlaying, setMusicPlaying] = useState(false);

	const [lightsOn, setLightsOn] = useState(false);
	const toggleLight = async () => {
		setLightsOn((prevState) => !prevState);

		// handle light change. Trigger via api
		await fetch("/api/toggle-lights?newState=" + !lightsOn)
			.then((res) => res.json())
			.then((json) => console.log(json))
			.catch((e) => console.error(e));
	};

	useEffect(async () => {
		// setMusicPlaying
		await fetch(`/api/sonos/status-room?room=${room}`)
			.then((res) => res.json())
			.then((json) => setMusicPlaying(json.status))
			.catch((e) => console.error(e));
	}, []);

	const toggleMusic = async () => {
		// setMusicPlaying
		await fetch(`/api/sonos/toggle-room?room=${room}`)
			.then((res) => res.json())
			.then((json) => setMusicPlaying(json.status))
			.catch((e) => console.error(e));
	};

	return (
		<div
			className={styles.container}
			style={{ backgroundColor: lightsOn ? "white" : "black" }}
		>
			<button onClick={toggleLight}>
				Turn Office Lights {lightsOn ? "Off" : "On"}
			</button>
			<button onClick={toggleMusic}>
				Turn Music in <em>{room}</em> {musicPlaying === "paused" ? "On" : "Off"}
			</button>
		</div>
	);
}
