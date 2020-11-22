const { Sonos } = require("sonos");
const { handleAll } = require("../utils/hue");

export default async (req, res) => {
	try {
		const statuses = await handleAll("on");

		res.statusCode = 200;
		res.json({
			name: "Hue All-Lights-On",
			statuses,
		});
	} catch (e) {
		res.statusCode = 400;
		res.json({
			name: "Hue All-Lights-On Error",
			statuses,
			error: e,
		});
	}
};
