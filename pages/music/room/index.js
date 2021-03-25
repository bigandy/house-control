import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";
import fetch from "node-fetch";

const pageTitle = "Music";

const { getFavorites } = require("pages/api/utils/sonos");

export default function MusicRoomPage({ favorites }) {
	const [musicPlaying, setMusicPlaying] = useState(false);

	const [selectedRoom, setSelectedRoom] = useState("bedroom");

	const [currentFavorite, setCurrentFavorite] = useState(null);

	useEffect(() => {
		const room = localStorage.getItem("room");

		console.log({ room });
		if (room) {
			setSelectedRoom(room);
		}
	}, []);

	useEffect(async () => {
		await fetch(`/api/sonos/status-all`)
			.then((res) => res.json())
			.then((json) => {
				const roomsObj = {};

				json.statuses.forEach((room) => {
					roomsObj[room.room] =
						room.state !== "paused" && room.state !== "stopped";
				});

				setMusicPlaying(roomsObj);
			})
			.catch((e) => console.error(e));
	}, []);

	useEffect(async () => {
		try {
			const statuses = await fetch(`/api/sonos/status-all`)
				.then((res) => res.json())
				.then((json) => {
					const roomsObj = {};
					json.statuses.forEach(
						(room) =>
							(roomsObj[room.room] =
								room.state !== "paused" && room.state !== "stopped")
					);
					setMusicPlaying(roomsObj);
				})
				.catch((e) => console.error(e));
		} catch (error) {
			console.error("error in useEffect", error);
		}
	}, [selectedRoom]);

	const playFavorite = async () => {
		// update state fast.
		// setPlaying((prevState) => !prevState);
		await fetch(
			`/api/sonos/play-favorite?favorite=${JSON.stringify(
				currentFavorite
			)}&room=${selectedRoom}`
		)
			.then((res) => res.json())
			.then(({ status }) => {
				// if the status is different, need to update the state then.
				// setPlaying(status === "transitioning");
			})
			.catch((e) => console.error(e));
	};

	const toggleRoom = async () => {
		await toggleMusic();
	};

	const playFavoriteNext = async () => {
		setCurrentFavorite(null);
		setMusicPlaying((prevState) => {
			return {
				...prevState,
				[selectedRoom]: false,
			};
		});
		await playFavorite();

		setMusicPlaying((prevState) => {
			return {
				...prevState,
				[selectedRoom]: true,
			};
		});
	};

	const toggleMusic = async () => {
		console.log("toggleMusic room", selectedRoom);
		await fetch(`/api/sonos/toggle-room/?room=${selectedRoom}`)
			.then((res) => res.json())
			.then((json) => {
				setMusicPlaying((prevState) => {
					return {
						...prevState,
						[selectedRoom]: json.status === "transitioning",
					};
				});
			})
			// .then((json) => {
			//   setMusicPlaying((prevState) => {
			//     return {
			//       ...prevState,
			//       [room]: json.status === "transitioning",
			//     };
			//   });
			// })
			.catch((e) => console.error(e));
	};

	// AHTODO:
	//   1. How to persist state to localStorage so that when I refresh the page, the room is pre-selected
	//   2. How to list the favorites from Sonos? Could be Spotify Playlists or something too

	const icon = useMemo(() => {
		const playIcon = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
		const pauseIcon =
			"M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";

		if (musicPlaying[selectedRoom]) {
			return playIcon;
		}
		return pauseIcon;
	}, [musicPlaying, selectedRoom]);

	const handleRoomChange = (room) => {
		setSelectedRoom(room);
		localStorage.setItem("room", room);
	};

	return (
		<DefaultLayout title="Music">
			<div className="play-wrapper">
				<button
					onClick={() => toggleRoom()}
					className={classnames({
						active: musicPlaying[selectedRoom],
					})}
				>
					<svg width="100px" height="100px" viewBox="0 0 36 36">
						<path d={icon} />
					</svg>
				</button>

				{currentFavorite && (
					<button onClick={playFavoriteNext}>
						Play {currentFavorite?.title}
					</button>
				)}
			</div>

			<h2>Selected Room is : {selectedRoom}</h2>
			<div className={styles.container}>
				{["bedroom", "lounge", "kitchen", "kitchen-eating"].map((room) => {
					return (
						<label
							htmlFor={room}
							key={room}
							className={classnames({
								active: room === selectedRoom,
							})}
						>
							<input
								id={room}
								type="radio"
								checked={room === selectedRoom}
								onChange={() => handleRoomChange(room)}
							/>
							{room}
						</label>
					);
				})}

				{favorites &&
					Object.keys(favorites).map((favorite) => {
						return (
							<button
								onClick={() => setCurrentFavorite(favorites[favorite])}
								key={favorite}
								className={classnames("button-music", {
									active: currentFavorite?.title === favorites[favorite].title,
								})}
							>
								{favorites[favorite].title}
							</button>
						);
					})}
			</div>
		</DefaultLayout>
	);
}

export async function getStaticProps(context) {
	const { formattedFavorites: favorites } = await getFavorites("bedroom");
	return {
		props: { favorites }, // will be passed to the page component as props
	};
}