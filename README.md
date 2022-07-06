# House Control via Next and API routes with Sonos and Hue

## TODO

- [ ] Graph of Temperature and Humidity over time
- [ ] Better track of spotify accessToken
- [ ] Better design of music/room page

## DONE

- [x] Dashboard that shows the time/date/weather
- [x] Sonos / Spotify so can search on a page (/music/room) and play that in the room selected.
- [x] Track data with SQLite and Prisma
- [x] node-cron to get measurement every 1 minute. in external folder.
- [x] Track data in DB (e.g. Hasura) and access via GraphQL endpoint
- [x] Temperature and Weather tracking using Raspberry Pi + sensor
- [x] Dashboard with Time / Date
- [x] Dashboard which allows user interaction i.e. if it is a touch screen allow all lights off or everything off
- [x] Dashboard shows current temperature outside / inside
- [x] Discovery of all lights
- [x] Status of all lights
- [x] Turn all lights off/on

## Future Ideas

- [ ] Radio Search / Favorite on Sonos with TuneIn / BBC
- [ ] Download each new Gilles Peterson show on a Sunday morning and save to Dropbox or SD card or SSD
- [ ] Google Home API to connect to `anything` in the Home i.e. my Tapo P100 plugs (no current JS API available)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

make an .env file with the following

```bash
HUE_BRIDGE_USER=""
HUE_BRIDGE_USER_CLIENT_KEY=""
HUE_BRIDGE_USER_IP=""

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
