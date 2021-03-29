const { CLIMACELL_API_KEY } = process.env;

import fetch from "node-fetch";

import { createUrl } from "../utils/urls";

export default async function handler(req, res) {
	try {
		const lat = 51.600121;
		const lon = -1.12481;
		const apikey = CLIMACELL_API_KEY;

		const url = createUrl({
			url: "https://api.climacell.co/v3/weather/realtime",
			query: {
				apikey,
				lat,
				lon,
				unit_system: "si",
				fields: "precipitation,temp,feels_like,weather_code,humidity",
			},
		});

		const result = await fetch(url).then((res) => {
			if (res.status !== 200) {
				throw new Error(res.statusText);
			}
			return res.json();
		});

		res.status(200).json({ message: "Get Weather", result });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Get Weather Error", error });
	}
}