import { PrismaClient } from "@prisma/client";

interface Global {
  prisma: PrismaClient;
}

declare const global: Global;

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
export { PrismaClient };
