import { loginDeviceByIp, getDeviceInfo } from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;

export const getAllPlugs = async () => {
  try {
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
            status: getDeviceInfoResponse.device_on,
            token,
            ...room,
          };
        } catch (e) {
          console.error("error", e);
        }
      })
    );

    return statuses;
  } catch (e) {
    console.error("error in getAllPlugs", e);
  }
};

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    const plugsObj = {};

    Object.keys(plugs).map((plug) => {
      const room = plugs[plug];

      plugsObj[room.name] = room.status;
    });

    await res.status(200).json({
      statuses: plugsObj,
    });
  } catch (e) {
    console.error("error in plug/statuses handler", e);
    res.status(400).json({ message: "Error", e });
  }
}
