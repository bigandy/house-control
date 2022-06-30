import { useEffect, useState } from "react";

import DefaultLayout from "layouts/default";

import fetch from "node-fetch";

export default function ColorPage() {
  const [lightId, setLightId] = useState("");

  const [lightIds, setLightIds] = useState([]);

  useEffect(() => {
    const getLights = async () => {
      await fetch(`/api/hue/getall-lights`)
        .then((res) => res.json())
        .then(({ lights }) => {
          const filteredLights = lights.filter((light) => {
            return light.state.reachable && light.state.hue;
          });
          setLightIds(filteredLights);

          setLightId(filteredLights[0].id);
        });
    };

    getLights();
  }, []);

  const toggleLight = async () => {
    const colorString = hue ? `&color=${(hue / 360) * 65535}` : "";

    await fetch(`/api/hue/color-light?lightId=${lightId}${colorString}`).catch(
      (e) => console.error(e)
    );
  };

  const [hue, setHue] = useState(0);
  const [color, setColor] = useState("#ff0000");

  const clearColor = () => {
    setColor("transparent");
    setHue(null);
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setColor(color);
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);

    console.log({ r, g, b });
    const { hue } = RGBToHSL(r, g, b);

    setHue(hue);
  };

  const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return {
      hue: 60 * h < 0 ? 60 * h + 360 : 60 * h,
      sat: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      lightness: (100 * (2 * l - s)) / 2,
    };
  };

  return (
    <DefaultLayout title="Color Light">
      <select value={lightId} onChange={(e) => setLightId(e.target.value)}>
        {lightIds.map((light) => {
          return (
            <option value={light.id} key={light.id}>
              {light.name}
            </option>
          );
        })}
      </select>

      <button onClick={toggleLight}>Toggle</button>

      <button onClick={clearColor} disabled={!hue}>
        Clear Color
      </button>
      {/* TODO: Replace with something like this: https://casesandberg.github.io/react-color/ */}
      <input type="color" value={color} onChange={handleColorChange} />
    </DefaultLayout>
  );
}
