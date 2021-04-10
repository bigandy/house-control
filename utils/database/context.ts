import prisma, { PrismaClient } from "utils/database/prisma";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse } from "http";

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
}

export function createContext({ res, req }): Context {
  return { prisma, res, req, requestSpan: req.span };
}
