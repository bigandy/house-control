import { v3 } from "node-hue-api";

const LightState = v3.lightStates.LightState;

const { HUE_BRIDGE_USER, HUE_BRIDGE_IP } = process.env;

export const OFFICE_LIGHT = 5;

export const getAllLights = async () => {
  try {
    const api: any = await getHueApi();
    const allLights = await api.lights.getAll();

    const lights = [];
    // Iterate over the light objects showing details
    allLights.forEach((light) => {
      const { id, name, state } = light;
      lights.push({ id, name, state });
    });

    return lights;
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

type State = {
  on?: boolean;
};

export const toggleLight = async (lightId = OFFICE_LIGHT) => {
  try {
    const api: any = await getHueApi();
    // Using a basic object to set the state
    const state: State = await api.lights.getLightState(lightId);

    await api.lights.setLightState(lightId, {
      on: !state.on,
    });

    const newState: State = await api.lights.getLightState(lightId);

    console.log({ newState });

    return newState.on;
  } catch (e) {
    console.error(e);
    throw new Error("bad things in toggleLight");
  }
};

export const offLight = async (lightId = OFFICE_LIGHT) => {
  try {
    const api: any = await getHueApi();
    const result = await api.lights.setLightState(lightId, {
      on: false,
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error("bad things in offLight");
  }
};

export const onLight = async (lightId = OFFICE_LIGHT) => {
  try {
    const api: any = await getHueApi();
    const result = await api.lights.setLightState(lightId, {
      on: true,
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error("bad things in onLight");
  }
};

export const statusLight = async (lightId = OFFICE_LIGHT) => {
  try {
    const allLights = await getAllLights();
    const light = allLights?.find((light) => light.id === lightId);
    return light;
  } catch (e) {
    console.error(e);
    throw new Error("bad things in Status Light");
  }
};

export const getHueApi = async () => {
  try {
    return await v3.api.createLocal(HUE_BRIDGE_IP).connect(HUE_BRIDGE_USER);
  } catch (error) {
    console.error("BAD THING", error);
    throw new Error("bad things in getHueApi");
  }
};

export const toggleRoom = async (roomId: number) => {
  try {
    const api: any = await getHueApi();
    const room = await api.groups.getGroup(roomId);
    const roomState = room.data.state.all_on;

    await api.groups.setGroupState(roomId, { on: !roomState });
    return !roomState;
  } catch (error) {
    console.error(error);
  }
};

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const colorLight = async (lightId = 2, hue = null) => {
  try {
    const api: any = await getHueApi();

    const lightState = new LightState()
      // .rgb(0, 255, 255);
      .hue(hue || randomNumber(0, 65535))
      .sat(254)
      .bri(254);
    // const oldState = {
    //   // rgb: [100, 100,100],
    //   hue: randomNumber(0, 65535), // 0 => 65535
    //   sat: '100', // 0 => 254
    //   bri: 254, // 1 => 254
    //   // ct: 153 // min:153 max: 500
    // };

    await api.lights.setLightState(lightId, lightState);
    const state: State = await api.lights.getLightState(lightId);
    return state;
  } catch (error) {
    console.error(error);
    throw new Error("Your color is not a good one");
  }
};
