import { loginDeviceByIp } from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;

export const getAllLights = async () => {
  try {
    const device = await loginDeviceByIp(
      email,
      password,
      process.env.TPLINK_LED_OFFICE_IP
    );
    // const getDeviceInfoResponse = await getDeviceInfo(deviceToken);

    return (await device.getDeviceInfo()).device_on;
  } catch (error) {
    console.error("error in getAllLights", error);
  }
};

export default async function handler(req, res) {
  try {
    const lights = await getAllLights();

    console.log("HERE BE LIGHTS", { lights });

    // const lightsObj = {};

    // Object.keys(lights).map((plug) => {
    //   const room = lights[plug];

    //   lightsObj[room.name] = room.status;
    // });

    await res.status(200).json({
      // lights: Object.keys(lights).map((light) => {
      //   const room = lights[light];
      //   return {
      //     name: room.name,
      //     // ip: room.ip,
      //     // token: room.token,
      //     status: room.response,
      //   };
      // }),
      // statuses: lightsObj,
      lights: lights,
    });
  } catch (e) {
    console.error("error in plug/statuses handler", e);
    res.status(400).json({ message: "Error", e });
  }
}
