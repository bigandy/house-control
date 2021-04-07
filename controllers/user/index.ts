import { extendType, objectType } from "nexus";
import { getSession } from "adapters/sessions";
import prisma from "utils/database/prisma";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.image();
    t.model.email();
    t.model.name();
  },
});

export const userQueryType = extendType({
  type: "Query",
  definition(t) {
    t.crud.user();
    t.crud.users({
      pagination: true,
      filtering: true,
      ordering: true,
      async resolve(root, args, ctx, info, originalResolve) {
        const session = await getSession(ctx);
        if (!session) {
          return [];
        }
        return await originalResolve(root, args, ctx, info);
      },
    });
  },
});

export const userMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.updateOneUser();
    t.crud.deleteOneUser();
    t.crud.updateOneUser({
      async resolve(root, args, ctx, info, originalResolve) {
        const session = await getSession(ctx);
        if (!session) {
          return;
        }
        return await originalResolve(root, args, ctx, info);
      },
    });
    t.crud.createOneUser({
      async resolve(root, args, ctx, info, originalResolve) {
        const session = await getSession(ctx);
        if (!session) {
          return;
        }
        return await originalResolve(root, args, ctx, info);
      },
    });
  },
});
