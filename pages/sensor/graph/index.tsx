import { useMemo } from "react";

import DefaultLayout from "layouts/default";

import { useSensorValuesQuery } from "controllers/sensorValues/hooks";
// import { ScatterPlotCanvas } from "@nivo/scatterplot";
import { LineCanvas } from "@nivo/line";

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 40 },
  animate: false,
};

export default function SensorGraphPage() {
  const { data } = useSensorValuesQuery();

  const internal = useMemo(() => {
    if (data?.sensorValues) {
      return data?.sensorValues
        .filter(({ type }, i) => type === "inside")
        .map(({ createdAt, temperature, humidity }) => {
          return {
            temperature,
            humidity,
            createdAt: new Date(createdAt),
          };
        });
    }
    return [];
  }, [data]);

  const external = useMemo(() => {
    if (data?.sensorValues) {
      return data?.sensorValues
        .filter(({ type }, i) => type === "outside")
        .map(({ createdAt, temperature, humidity }) => {
          return {
            temperature,
            humidity,
            createdAt: new Date(createdAt),
          };
        });
    }
    return [];
  }, [data]);

  return (
    <DefaultLayout title="Sensor Graph">
      {data?.sensorValues?.length > 0 && (
        <div style={{ padding: "0 1rem" }}>
          <h2>Temperature</h2>
          <LineCanvas
            {...commonProperties}
            data={[
              {
                id: "Out Temperature",
                data: external.map((d) => ({
                  x: d.createdAt,
                  y: d?.temperature?.toFixed(0) || null,
                })),
              },
              {
                id: "IN Temperature",
                data: internal.map((d) => ({
                  x: d.createdAt,
                  y: d.temperature.toFixed(0),
                })),
              },
            ]}
            xScale={{
              type: "time",
              format: "native",
              precision: "day",
            }}
            xFormat="time:%Y-%m-%d"
            axisBottom={{
              format: "%b %d",
              tickValues: "every 2 days",
            }}
          />

          <h2>Humidity</h2>

          <LineCanvas
            {...commonProperties}
            data={[
              {
                id: "IN Humidity",
                data: internal.map((d) => ({
                  x: d.createdAt,
                  y: d.humidity.toFixed(0),
                })),
              },

              {
                id: "Out Humidity",
                data: external.map((d) => ({
                  x: d.createdAt,
                  y: d?.humidity?.toFixed(0) || null,
                })),
              },
            ]}
            xScale={{
              type: "time",
              format: "native",
              precision: "day",
            }}
            xFormat="time:%Y-%m-%d"
            axisBottom={{
              format: "%b %d",
              tickValues: "every 2 days",
            }}
          />
        </div>
      )}
    </DefaultLayout>
  );
}
