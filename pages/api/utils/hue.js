const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { HUE_BRIDGE_USER, HUE_BRIDGE_USER_CLIENT_KEY } = process.env;

const USERNAME = HUE_BRIDGE_USER;

const OFFICE_LIGHT = 5;

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
      const lights = [];
      // Iterate over the light objects showing details
      allLights.forEach((light) => {
        const { id, name, state } = light;
        lights.push({ id, name, state });
      });

      return lights;
    })
    .catch((err) => {
      console.error(err);
    });
  return statuses;
};

const handleAll = async (method = "off") => {
  const devices = await getAllLights();

  await devices.reduce(async (previousPromise, nextID) => {
    await previousPromise;

    if (method === "off") {
      return offLight(nextID.id);
    } else if (method === "on") {
      return onLight(nextID.id);
    } else if (method === "toggle") {
      return toggleLight(nextID.id);
    } else {
      throw new Error("No known light method");
    }
  }, Promise.resolve());
  const statuses = await getAllLights();

  return statuses;
};

const toggleLight = async (lightId = OFFICE_LIGHT) => {
  return v3.discovery
    .nupnpSearch()
    .then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(async (api) => {
      // Using a basic object to set the state
      const state = await api.lights.getLightState(lightId);

      const result = await api.lights.setLightState(lightId, {
        on: !state.on,
      });
      return !state.on;
    })
    .catch((e) => {
      throw new Error("lights failed");
    });
};

const offLight = async (lightId = OFFICE_LIGHT) => {
  return v3.discovery
    .nupnpSearch()
    .then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(async (api) => {
      // Using a basic object to set the state
      const state = await api.lights.getLightState(lightId);

      const result = await api.lights.setLightState(lightId, {
        on: false,
      });
      return result;
    })
    .catch((e) => {
      throw new Error("lights failed");
      res.send({
        statusCode: 400,
        body: JSON.stringify(e),
      });
    });
};

const onLight = async (lightId = OFFICE_LIGHT) => {
  return v3.discovery
    .nupnpSearch()
    .then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(async (api) => {
      const result = await api.lights.setLightState(lightId, {
        on: true,
      });
      return result;
    })
    .catch((e) => {
      throw new Error("lights failed");
      res.send({
        statusCode: 400,
        body: JSON.stringify(e),
      });
    });
};

const statusLight = async (lightId = OFFICE_LIGHT) => {
  const allLights = await getAllLights();
  const light = allLights.find((light) => light.id === lightId);
  return light;
};

module.exports = {
  OFFICE_LIGHT,
  getAllLights,
  toggleLight,
  onLight,
  offLight,
  statusLight,
  handleAll,
};
