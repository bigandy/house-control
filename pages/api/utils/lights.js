const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { HUE_BRIDGE_USER, HUE_BRIDGE_USER_CLIENT_KEY } = process.env;

const USERNAME = HUE_BRIDGE_USER;

const getAllLights = async () => {
	const statuses = await v3.discovery
		.nupnpSearch()
		.then((searchResults) => {
			const host = searchResults[0].ipaddress;
			return v3.api.createLocal(host).connect(USERNAME);
		})
		.then((api) => {
			return api.lights.getAll();
		})
		.then((allLights) => {
			// Display the details of the lights we got back
			console.log(JSON.stringify(allLights, null, 2));
			const lights = [];
			// Iterate over the light objects showing details
			allLights.forEach((light) => {
				const { id, name, state } = light;
				console.log({ id, name, state });
				lights.push({ id, name, state });
			});

			// res.statusCode = 200;
			// res.json({
			// 	name: "Hue getall-lights",
			// 	lights,
			// });
			return lights;
		})
		.catch((err) => {
			console.error(err);
		});
	return statuses;
};

module.exports = {
	OFFICE_LIGHT: 5,
	getAllLights,
};
