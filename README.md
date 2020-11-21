# House Control via Next and API routes with Sonos and Hue

## TODO

- [ ] Discovery of all lights
- [ ] Status of all lights
- [ ] Turn all lights off/on

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
```

## How to run on Raspberry Pi

- run `npm run build`
- run `npm run start` to run the server

### PM2

If you want to run this continually you'll need `pm2`.

- `pm2 start npm --name "Next App" -- start`
- if you want to set pm2 to start when the pi boots follow [this tutorial](https://medium.com/@andrew.nease.code/set-up-a-self-booting-node-js-eb56ebd05549)
