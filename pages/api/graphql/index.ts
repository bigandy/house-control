// import { ApolloServer } from "apollo-server-micro";
// import { schema } from "utils/database/schema";
// import { createContext } from "utils/database/context";
// import { ApolloLogPlugin } from "apollo-log";

// const server = new ApolloServer({
//   schema,
//   context: createContext,
//   tracing: process.env.NODE_ENV === "development",
//   plugins: [
//     ApolloLogPlugin({
//       events: {
//         didEncounterErrors: true,
//         didResolveOperation: true,
//         executionDidStart: true,
//         parsingDidStart: true,
//         responseForOperation: true,
//         validationDidStart: true,
//         willSendResponse: true,
//       },
//     }),
//   ],
// });

// const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

// export default handler;
