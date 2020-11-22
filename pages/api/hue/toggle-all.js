const { Sonos } = require("sonos");
const { handleAll } = require("../utils/hue");

export default async (req, res) => {
	try {
		const statuses = await handleAll("toggle");

		res.statusCode = 200;
		res.json({
			name: "Hue All-Lights-Toggle",
			statuses: statuses.map((item) => {
				status: item.status.on;
			}),
		});
	} catch (e) {
		res.statusCode = 400;
		res.json({
			name: "Hue All-Lights-Toggle Error",
			error: e,
		});
	}
};
