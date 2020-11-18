import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

const rooms = [
	{
		text: "Lounge",
		id: "lounge",
	},
	{
		text: "Kitchen",
		id: "kitchen",
	},
	{
		text: "Kitchen Eating",
		id: "kitchen-eating",
	},
	{
		text: "Bedroom",
		id: "bedroom",
	},
];

const RoomSelector = ({ selected, handleChange }) => {
	return (
		<select onChange={handleChange}>
			{rooms.map((room, index) => {
				return (
					<option value={room.id} key={`select-${index}`}>
						{room.text}
					</option>
				);
			})}
		</select>
	);
};

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
		await fetch(`/api/sonos/status/${room}`)
			.then((res) => res.json())
			.then((json) => setMusicPlaying(json.status))
			.catch((e) => console.error(e));
	}, [room]);

	const toggleMusic = async () => {
		// setMusicPlaying
		await fetch(`/api/sonos/toggle/${room}`)
			.then((res) => res.json())
			.then((json) => setMusicPlaying(json.status))
			.catch((e) => console.error(e));
	};

	const handleRoomChange = (e) => {
		// console.log(e.target.value);
		setRoom(e.target.value);
	};

	return (
		<div
			className={styles.container}
			style={{ backgroundColor: lightsOn ? "white" : "black" }}
		>
			<RoomSelector handleChange={handleRoomChange} selected={room} />

			<button onClick={toggleLight}>
				Turn Office Lights {lightsOn ? "Off" : "On"}
			</button>
			<button onClick={toggleMusic}>
				Turn Music in <em>{room}</em>{" "}
				{musicPlaying === "paused" || musicPlaying === "stopped" ? "On" : "Off"}
			</button>
		</div>
	);
}
