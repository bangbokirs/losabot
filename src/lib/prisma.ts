import { PrismaClient as LosaGameClient } from "@prisma/losagame";
import { PrismaClient as LosaLogClient } from "@prisma/losalogdata";

const globalForPrisma = globalThis as unknown as {
  LosaGame: LosaGameClient;
  LosaLog: LosaLogClient;
};

export const LosaGameDB = globalForPrisma.LosaGame || new LosaGameClient();

export const LosaLogDB = globalForPrisma.LosaLog || new LosaLogClient();

if (process.env.NODE_ENV !== "production") {
  console.log("Development mode: setting global Prisma instance");
  globalForPrisma.LosaGame = LosaGameDB;
  globalForPrisma.LosaLog = LosaLogDB;
}
