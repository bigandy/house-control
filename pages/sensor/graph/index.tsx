import { useState, useEffect, Fragment, useMemo } from "react";

import DefaultLayout from "layouts/default";

import { useSensorValuesQuery } from "controllers/sensorValues/hooks";
import { ScatterPlot } from "@nivo/scatterplot";

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 40 },
  animate: false,
  enableSlices: "x",
};

const curveOptions = ["linear", "monotoneX", "step", "stepBefore", "stepAfter"];

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
  <g>
    <circle
      fill="#fff"
      r={size / 2}
      strokeWidth={borderWidth}
      stroke={borderColor}
    />
    <circle
      r={size / 5}
      strokeWidth={borderWidth}
      stroke={borderColor}
      fill={color}
      fillOpacity={0.35}
    />
  </g>
);

export default function SensorGraphPage() {
  const { data } = useSensorValuesQuery();

  const internal = useMemo(() => {
    if (data?.sensorValues) {
      return data.sensorValues
        .filter(({ type }) => type === "inside")
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
      return data.sensorValues
        .filter(({ type }) => type === "outside")
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
      <ul>
        <li>
          A graph showing the results of the temp (internal and external) over
          time
        </li>
        <li>
          A graph showing the results of the humidiy (internal and external)
          over time
        </li>
      </ul>

      {data?.sensorValues?.length > 0 && (
        <ScatterPlot
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
              id: "IN Temperature",
              data: internal.map((d) => ({
                x: d.createdAt,
                y: d.temperature.toFixed(0),
              })),
            },

            {
              id: "Out Temperature",
              data: external.map((d) => ({
                x: d.createdAt,
                y: d?.temperature?.toFixed(0) || null,
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
      )}
    </DefaultLayout>
  );
}
