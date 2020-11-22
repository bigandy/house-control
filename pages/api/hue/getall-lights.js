const { getAllLights } = require("../utils/hue");

export default async function handler(req, res) {
	const lights = await getAllLights();

	res.statusCode = 200;
	res.json({
		name: "Hue getall-lights",
		lights: lights.map((light) => light.id),
	});
}
