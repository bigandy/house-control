import { useSensorValuesQuery } from "controllers/sensorValues/hooks";
import { format } from "date-fns";
import classes from "./styles.module.scss";

const SensorResultsTable = () => {
  const { data } = useSensorValuesQuery();

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>Created</th>
          <th>Temp (&deg;C)</th>
          <th>Humidity (%)</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {data?.sensorValues
          .map((d) => {
            const date = new Date(d.createdAt);

            return (
              <tr key={d.id}>
                <td>
                  {format(date, "H:mm")} - {format(date, "do-MMM-yyyy")}
                </td>
                <td>{d.temperature}</td>
                <td>{d.humidity}</td>
                <td>{d.type}</td>
              </tr>
            );
          })
          .reverse()}
      </tbody>
    </table>
  );
};

export default SensorResultsTable;
