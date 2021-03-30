import { ApolloServer } from "apollo-server-micro";
import { makeSchema, objectType, extendType } from "nexus";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import prisma from "utils/database/prisma";

const Temparature = objectType({
  name: "Temparature",
  definition(t) {
    t.model.id();
    t.model.user();
    t.model.target();
  },
});

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.email();
    t.model.name();
  },
});

const activityQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.activity();
    t.crud.activities({ ordering: true, filtering: true, pagination: true });
    t.crud.users();
    t.crud.cadence();
    t.crud.cadences({ ordering: true, filtering: true, pagination: true });
  },
});

export const cadenceMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneCadence();
    t.crud.updateOneCadence();
  },
});

const schema = makeSchema({
  types: [activityQuery, Activity, User, Cadence, cadenceMutation],
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
});

let server = new ApolloServer({
  schema,
  context: { prisma },
  tracing: process.env.NODE_ENV === "development",
});

const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
