import { extendType, objectType } from "nexus";
import { getSession } from "adapters/sessions";

export const SensorValue = objectType({
  name: "SensorValue",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.temperature();
    t.model.humidity();
  },
});

export const sensorQueryType = extendType({
  type: "Query",
  definition(t) {
    t.crud.sensorValue();
    t.crud.sensorValues({
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

export const sensorValueMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.updateOneSensorValue();
    t.crud.deleteOneSensorValue();
    t.crud.updateOneSensorValue({
      async resolve(root, args, ctx, info, originalResolve) {
        const session = await getSession(ctx);
        if (!session) {
          return;
        }
        return await originalResolve(root, args, ctx, info);
      },
    });
    t.crud.createOneSensorValue({
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
