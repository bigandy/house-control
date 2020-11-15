const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { OFFICE_LIGHT } = require("./utils/lights");

const { HUE_BRIDGE_USER, HUE_BRIDGE_USER_CLIENT_KEY } = process.env;

const USERNAME = HUE_BRIDGE_USER,
	LIGHT_ID = 5;

const stateOn = new LightState().on().ct(200);
const stateOff = new LightState().off().ct(200);

export default function handler(req, res) {
	const {
		query: { newState },
	} = req;

	v3.discovery
		.nupnpSearch()
		.then((searchResults) => {
			const host = searchResults[0].ipaddress;
			return v3.api.createLocal(host).connect(USERNAME);
		})
		.then((api) => {
			// Using a basic object to set the state
			return api.lights.setLightState(LIGHT_ID, {
				on: newState === "true" ? true : false,
			});
		})
		.then((result) => {
			console.log(`Light state change was successful? ${result}`);

			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(
				JSON.stringify({
					query: req.query,
					newState,
				})
			);
		})
		.catch((e) => {
			throw new Error("lights failed");
		});
}
