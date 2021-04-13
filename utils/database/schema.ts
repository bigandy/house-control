import { makeSchema } from "nexus";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import path from "path";
import { applyMiddleware } from "graphql-middleware";
import * as controllers from "controllers";
import { GraphQLScalarType } from "graphql";

const baseSchema = makeSchema({
  types: controllers,
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  plugins: [
    nexusSchemaPrisma({
      shouldGenerateArtifacts: process.env.NODE_ENV === "development",
      scalars: {
        DateTime: new GraphQLScalarType({
          name: "DateTime",
          description: "DateTime",
          serialize(data) {
            return data.toISOString();
          },
          parseValue(data) {
            return new Date(data);
          },
          parseLiteral(ast) {
            //@ts-ignore
            return new Date(ast.value).toISOString();
          },
        }),
      },
      experimentalCRUD: true,
      paginationStrategy: "prisma", // required!
      outputs: {
        typegen: path.join(process.cwd(), "nexus-prisma-typegen.ts"),
      },
    }),
  ],
  outputs: {
    schema: path.join(process.cwd(), "schema.graphql"),
    typegen: path.join(process.cwd(), "nexus-typegen.ts"),
  },
  contextType: {
    module: path.join(process.cwd(), "utils", "database", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});

export const schema = applyMiddleware(baseSchema);
