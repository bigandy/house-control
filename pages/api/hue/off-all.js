const { Sonos } = require("sonos");
const { handleAll } = require("../utils/hue");

export default async (req, res) => {
	try {
		const statuses = await handleAll("off");

		res.statusCode = 200;
		res.json({
			name: "Hue All-Lights-Off",
			statuses,
		});
	} catch (e) {
		res.statusCode = 400;
		res.json({
			name: "Hue All-Lights-Off Error",
			statuses,
			error: e,
		});
	}
};
