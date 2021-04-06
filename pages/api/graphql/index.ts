import { ApolloServer } from "apollo-server-micro";
import { schema } from "utils/database/schema";
import { createContext } from "utils/database/context";
import { ApolloLogPlugin } from "apollo-log";

// const schema = makeSchema({
//   types: [User, userQuery],
//   plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
// });

let server = new ApolloServer({
  schema,
  context: createContext,
  tracing: process.env.NODE_ENV === "development",
});

const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
