import { useQuery } from "@apollo/client";

import { SENSOR_QUERY } from "./graphql";
// import { TagOrderByInput, TagWhereInput } from "housecontrol-graphql";

export function useSensorValuesQuery() {
  return useQuery(SENSOR_QUERY, {
    variables: {},
  });
}
