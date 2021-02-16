import {
  cloudLogin,
  listDevicesByType,
  listDevices,
  loginDeviceByIp,
  loginDevice,
  turnOff,
  turnOn,
  getDeviceInfo,
  loginDeviceBy,
} from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;

export const getAllPlugs = async () => {
  const cloudToken = await cloudLogin(
    process.env.TPLINK_EMAIL,
    process.env.TPLINK_PASSWORD
  );

  const rooms = [
    {
      ip: process.env.TPLINK_PLUG_OFFICE_IP,
      name: "office",
    },
    {
      ip: process.env.TPLINK_PLUG_2_IP,
      name: "2",
    },
    {
      ip: process.env.TPLINK_PLUG_3_IP,
      name: "3",
    },
    {
      ip: process.env.TPLINK_PLUG_4_IP,
      name: "4",
    },
  ];

  const statuses = {};
  await Promise.all(
    rooms.map(async (room) => {
      try {
        const token = await loginDeviceByIp(email, password, room.ip);
        const getDeviceInfoResponse = await getDeviceInfo(token);

        statuses[room.name] = {
          response: getDeviceInfoResponse.device_on,
          ...room,
          token,
        };
      } catch (error) {
        console.error("error", error);
      }
    })
  );

  return statuses;
};

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();
    await res.status(200).json({
      plugs: Object.keys(plugs).map((plug) => {
        const room = plugs[plug];
        return {
          name: room.name,
          ip: room.ip,
          token: room.token,
          status: room.response,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error", error });
  }
}
