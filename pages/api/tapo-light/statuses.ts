import {
  cloudLogin,
  listDevicesByType,
  listDevices,
  loginDeviceByIp,
  loginDevice,
  turnOff,
  turnOn,
  getDeviceInfo,
} from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;

export const getAllLights = async () => {
  try {
    const cloudToken = await cloudLogin(email, password);
    const devices = await listDevicesByType(cloudToken, "SMART.TAPOBULB");
    // const statuses = {};

    // const token = await loginDeviceByIp('ahudson@gmail.com', password, "192.168.86.224");
    // const getDeviceInfoResponse = await getDeviceInfo(token);

    const smartBulb = devices[0];
    console.log(smartBulb);

    const deviceToken = await loginDeviceByIp(
      email,
      password,
      process.env.TPLINK_LED_STRIP_IP
    );
    // const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
    console.log(deviceToken);

    return deviceToken;
  } catch (error) {
    console.error("error in getAllLights", error);
  }
};

export default async function handler(req, res) {
  try {
    const lights = await getAllLights();

    console.log({ lights });

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
      lights,
    });
  } catch (e) {
    console.error("error in plug/statuses handler", e);
    res.status(400).json({ message: "Error", e });
  }
}
