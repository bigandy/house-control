const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { OFFICE_LIGHT } = require("../utils/hue");

const { HUE_BRIDGE_USER, HUE_BRIDGE_USER_CLIENT_KEY } = process.env;

const USERNAME = HUE_BRIDGE_USER,
	LIGHT_ID = OFFICE_LIGHT;

export default function handler(req, res) {
	v3.discovery
		.nupnpSearch()
		.then((searchResults) => {
			const host = searchResults[0].ipaddress;
			return v3.api.createLocal(host).connect(USERNAME);
		})
		.then(async (api) => {
			await api.lights.getLightState(LIGHT_ID).then((state) => {
				// Display the state of the light
				console.log(JSON.stringify(state, null, 2));

				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify({
						query: req.query,
						state,
					})
				);
			});
		})
		.catch((e) => {
			throw new Error("lights failed");
		});
}
