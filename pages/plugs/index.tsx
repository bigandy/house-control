import { useState, useEffect } from "react";

import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

const plugs = ["office-led", "office"];

const initialPlugState = {};
plugs.forEach((plug) => {
  initialPlugState[plug] = false;
});

export default function Home() {
  const [status, setStatus] = useState(initialPlugState);

  useEffect(() => {
    const getAllStatuses = async () => {
      const plugs = await fetch(`/api/plug/statuses`)
        .then((res) => res.json())
        .then((json) => {
          if (json.message) {
            console.error(json.message);
            return;
          }
          setStatus(json.statuses);
        })
        .catch((e) => console.error(e));
    };
    getAllStatuses();
  }, []);

  const togglePlug = async (plug) => {
    await fetch(`/api/plug/plug-toggle/?room=${plug}`)
      .then((res) => res.json())
      .then(({ statusOut }) => {
        setStatus((prevState) => {
          return {
            ...(prevState as any),
            [plug]: statusOut,
          };
        });
      })
      .catch((e) => console.error(e));
  };

  const offAllPlugs = async (plug) => {
    await fetch(`/api/plug/plug-all-off`)
      .then((res) => res.json())
      .then(({ statusesOut }) => {
        setStatus((prevState) => {
          Object.keys(prevState).forEach((key) => {
            prevState[key] = statusesOut[key].status;
          });
          return { ...prevState };
        });
      })

      .catch((e) => console.error(e));
  };

  return (
    <DefaultLayout title="Plugs">
      <div className={styles.container}>
        <button onClick={offAllPlugs}>Off All</button>

        {plugs.map((plug) => {
          return (
            <button
              key={plug}
              onClick={() => togglePlug(plug)}
              className={classnames("button-plug", {
                active: status[plug],
              })}
            >
              {plug}
            </button>
          );
        })}
      </div>
    </DefaultLayout>
  );
}
