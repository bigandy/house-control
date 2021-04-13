import { gql } from "@apollo/client";

export const SENSOR_QUERY = gql`
  query {
    sensorValues {
      id
      temperature
      humidity
      createdAt
    }
  }
`;
