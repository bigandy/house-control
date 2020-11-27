# House Control via Next and API routes with Sonos and Hue

## TODO

- [ ] Track data in Firebase or other (e.g. Sanity / Fauna)
- [x] Temperature and Weather tracking using Raspberry Pi + sensor
- [x] Dashboard with Time / Date
- [ ] Dashboard which allows user interaction i.e. if it is a touch screen allow all lights off or everything off
- [ ] Dashboard that shows the weather for day / next 3 days
- [x] Dashboard shows current temperature outside / inside
- [ ] Google Home API to connect to `anything` in the Home i.e. my Tapo P100 plugs (no current JS API available)
- [x] Discovery of all lights
- [x] Status of all lights
- [x] Turn all lights off/on

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

make an .env file with the following

```bash
HUE_BRIDGE_USER=""
HUE_BRIDGE_USER_CLIENT_KEY=""

SONOS_KITCHEN_IP=""
SONOS_KITCHEN_EATING_IP=""
SONOS_BEDROOM_IP=""
SONOS_LOUNGE_IP=""

CLIMACELL_API_KEY=""
```

## How to run on Raspberry Pi

- run `npm run build`
- run `npm run start` to run the server

### PM2

If you want to run this continually you'll need `pm2`.

- `pm2 start npm --name "Next App" -- start`
- if you want to set pm2 to start when the pi boots follow [this tutorial](https://medium.com/@andrew.nease.code/set-up-a-self-booting-node-js-eb56ebd05549)
- Restart pm2 with `pm2 restart "Next App"

## Weather API
I am going to try out ClimaCell.

## Inside Temperature with DHT22 sensor
I'm running this on the raspberry pi: [https://www.npmjs.com/package/node-dht-sensor]()
