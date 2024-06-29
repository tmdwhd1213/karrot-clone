import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

async function test() {
  const user = await db.user.findMany({
    where: {
      username: {
        contains: "est",
      },
    },
  });

  console.log(user);
}

async function test2() {
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
    include: {
      user: true,
    },
  });

  console.log(token);
}
// test2();
// test();

export default db;
