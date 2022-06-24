import { v3, discovery } from "node-hue-api";

const { HUE_BRIDGE_USER } = process.env;

const USERNAME = HUE_BRIDGE_USER;

export const OFFICE_LIGHT = 5;

export const getAllLights = async () => {
  try {
    const statuses = await discovery
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
    .catch((e) => {
      console.error('bad things in catch', e);
      throw new Error('bad things in getAllLights')
    });
  return statuses;
  } catch (e) {
    console.error(e);
  }
  
};

export const handleAll = async (method = "off") => {
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

export const toggleLight = async (lightId = OFFICE_LIGHT) => {
  return discovery
    .nupnpSearch()
    .then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(async (api) => {
      // Using a basic object to set the state
      const state = await api.lights.getLightState(lightId);

      // const result = await api.lights.setLightState(lightId, {
      //   on: !state.on,
      // });
      // @ts-ignore
      return !state.on;
    })
    .catch((e) => {
      console.error('error in toggleLight', e)
      throw new Error("lights failed");
    });
};

export const offLight = async (lightId = OFFICE_LIGHT) => {
  return discovery
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
    });
};

export const onLight = async (lightId = OFFICE_LIGHT) => {
  return discovery
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
    });
};

export const statusLight = async (lightId = OFFICE_LIGHT) => {
  try {
    const allLights = await getAllLights();
    console.log({allLights})
    const light = allLights?.find((light) => light.id === lightId);
    return light;
  } catch (e) {
    console.error(e);
    throw new Error('bad things in Status Light')
  }
};

export const getHueApi = async () => {
  try {
    const thing = await discovery.nupnpSearch().then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .catch(e => console.error(e));  

    console.log({thing : await discovery.nupnpSearch()})

    return thing;
  } catch (error) {
    console.error('BAD THING', error)
  }
};

export const toggleRoom = async (roomId = 1) => {
  try {
    const api: any = await getHueApi();
    console.log({api}) 
    const room = await api.groups.getGroup(roomId);
    const roomState = room._data.state;

    const on = !roomState.all_on;

    await api.groups.setGroupState(roomId, { on });
  return on;  
  } catch (error) {
    console.error(error)
  }
  
};
