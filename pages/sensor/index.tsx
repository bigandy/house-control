import { useState, useEffect, Fragment, useMemo } from "react";

import DefaultLayout from "layouts/default";

import SensorResultsTable from "components/SensorResultsTable";

export default function SensorPage() {
  return (
    <DefaultLayout title="Sensor">
      <SensorResultsTable />
    </DefaultLayout>
  );
}
