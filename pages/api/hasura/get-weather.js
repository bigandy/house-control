const { query } = require("../utils/hasura");

export default async function handler(req, res) {
  const limit = Number(req.query.number) || null;
  console.log(limit);
  try {
    const { sensor_data } = await query({
      query: `
        query MyQuery($limit: Int) {
          sensor_data(limit: $limit, order_by: {created_at: desc}) {
            humidity
            temperature
            created_at
          }
        }

        `,
      variables: {
        limit,
      },
    });

    res.status(200).json({
      message: "Get Weather Values",
      query: req.query,
      sensor_data,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error", error });
  }
}
