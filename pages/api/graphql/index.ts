// @ts-nocheck
import { ApolloServer } from "apollo-server-micro";
import { makeSchema, objectType, extendType } from "nexus";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import prisma from "utils/database/prisma";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.email();
    t.model.name();
  },
});

const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.users();
  },
});



const schema = makeSchema({
  types: [User, userQuery],
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

