import prisma, { PrismaClient } from "utils/database/prisma";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse } from "http";
import { UserType, Onboards, SubscriptionStatus } from "truenorth-graphql";

export interface Context {
  prisma: PrismaClient;
  requestSpan?: any;
  res: ServerResponse;
  req: MicroRequest;
}

export interface User {
  name: string;
  email: string;
  image: string;
  userId: string;
  selectedTeamId: string;
  subscriptionStatus: SubscriptionStatus | undefined;
  subscriptionActive: boolean;
  completedOnboards: Onboards[];
  type: UserType;
}

export function createContext({ res, req }): Context {
  return { prisma, res, req, requestSpan: req.span };
}
