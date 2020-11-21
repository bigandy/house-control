const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { OFFICE_LIGHT } = require("../utils/lights");

const { HUE_BRIDGE_USER, HUE_BRIDGE_USER_CLIENT_KEY } = process.env;

const USERNAME = HUE_BRIDGE_USER,
	LIGHT_ID = 5;

export default function handler(req, res) {
	v3.discovery
		.nupnpSearch()
		.then((searchResults) => {
			const host = searchResults[0].ipaddress;
			return v3.api.createLocal(host).connect(USERNAME);
		})
		.then(async (api) => {
			// Using a basic object to set the state
			const state = await api.lights.getLightState(LIGHT_ID);

			const result = await api.lights.setLightState(LIGHT_ID, {
				on: state.on ? false : true,
			});
			return result;
		})
		.then((result) => {
			console.log(`Light state change was successful? ${result}`);

			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(
				JSON.stringify({
					result,
				})
			);
		})
		.catch((e) => {
			throw new Error("lights failed");
			res.send({
				statusCode: 400,
				body: JSON.stringify(e),
			});
		});
}
