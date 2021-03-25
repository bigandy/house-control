import { useState, useEffect } from "react";
import Head from "next/head";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import { sonosRooms } from "utils/sonos";

const RoomSelector = ({ selected, handleChange }) => {
	return (
		<select onChange={handleChange} value={selected}>
			{sonosRooms.map((room, index) => {
				return (
					<option value={room.id} key={`select-${index}`}>
						{room.text}
					</option>
				);
			})}
		</select>
	);
};

export default function HomePage() {
	const [selectedRoom, setSelectedRoom] = useState("bedroom");
	const [musicPlaying, setMusicPlaying] = useState(false);

	const [lightsOn, setLightsOn] = useState(false);

	useEffect(() => {
		const room = localStorage.getItem("room");
		if (room) {
			setSelectedRoom(room);
		}
	}, []);

	const toggleLight = async () => {
		await fetch("/api/hue/toggle-light")
			.then((res) => res.json())
			.then((json) => {
				setLightsOn((prevState) => !prevState);
			})
			.catch((e) => console.error(e));
	};

	useEffect(async () => {
		await fetch(`/api/sonos/status-all`)
			.then((res) => res.json())
			.then(({ statuses }) => {
				const roomsObj = {};
				statuses.forEach(
					({ room, state }) =>
						(roomsObj[room] = state !== "paused" && state !== "stopped")
				);
				setMusicPlaying(roomsObj);
			})
			.catch((e) => console.error(e));
	}, []);

	useEffect(async () => {
		await fetch(`/api/hue/status-light`)
			.then((res) => res.json())
			.then((json) => setLightsOn(json.state.on))
			.catch((e) => console.error(e));
	}, []);

	const toggleMusic = async () => {
		await fetch(`/api/sonos/toggle-room/?room=${selectedRoom}`)
			.then((res) => res.json())
			.then(({ state }) => {
				setMusicPlaying((prevState) => {
					return {
						...prevState,
						[selectedRoom]: state !== "paused" && state !== "stopped",
					};
				});
			})
			.catch((e) => console.error(e));
	};

	const handleRoomChange = (e) => {
		const { value } = e.target;
		setSelectedRoom(value);
		localStorage.setItem("room", value);
	};

	const turnOffAllSonos = async () => {
		await fetch(`/api/sonos/pause-all`).catch((e) => console.error(e));
	};

	const turnOffAllHue = async () => {
		await fetch(`/api/hue/off-all`).catch((e) => console.error(e));
	};

	const turnOffAllPlugs = async () => {
		await fetch(`/api/plug/plug-all-off`).catch((e) => console.error(e));
	};

	const turnOffEverything = async () => {
		await turnOffAllHue();
		await turnOffAllSonos();
		await turnOffAllPlugs();
	};

	console.log(musicPlaying);

	return (
		<DefaultLayout>
			<Head>
				<title>Homepage</title>
			</Head>
			<div className={styles.container}>
				<RoomSelector handleChange={handleRoomChange} selected={selectedRoom} />

				<button onClick={toggleLight}>
					Turn Office Lights {lightsOn ? "Off" : "On"}
				</button>
				<button onClick={toggleMusic}>
					Turn Music in <em>{selectedRoom}</em>{" "}
					{musicPlaying[selectedRoom] ? "Off" : "On"}
				</button>
				<button onClick={turnOffAllSonos}>Turn All SONOS off</button>
				<button onClick={turnOffAllHue}>Turn All HUE off</button>
				<button onClick={turnOffEverything}>Turn Everything off</button>
			</div>
		</DefaultLayout>
	);
}
