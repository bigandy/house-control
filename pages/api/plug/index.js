import {
  cloudLogin,
  listDevicesByType,
  listDevices,
  loginDeviceByIp,
  turnOff,
  turnOn,
  getDeviceInfo,
} from "./tp-link-tapo-connect/api";

export default async function handler(req, res) {
  try {
    const cloudToken = await cloudLogin(
      process.env.TPLINK_EMAIL,
      process.env.TPLINK_PASSWORD
    );

    // const devices = await listDevicesByType(cloudToken, "SMART.TAPOPLUG");
    const devices = await listDevices(cloudToken);

    // console.log(devices);
    // find office.
    const officeDevice = devices.find(
      (device) => device.alias.toLowerCase() === "office"
    );

    // const officeDeviceToken = await loginDeviceByIp(
    //   process.env.TPLINK_EMAIL,
    //   process.env.TPLINK_PASSWORD,
    //   process.env.TPLINK_PLUG_OFFICE_IP
    // );

    // console.log(officeDeviceToken);

    // const deviceInfoOffice = status(officeDevice);

    // await turnOff(officeDeviceToken);
    // await turnOn(officeDeviceToken);

    // console.log(await status(officeDeviceToken));

    res.status(200).json({
      //   officeDevice,
      devices,
      //   deviceInfoOffice,
      //   officeDevice,
      //   officeDeviceToken,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error", error });
  }
}
