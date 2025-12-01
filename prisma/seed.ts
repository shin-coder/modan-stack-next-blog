import { PrismaClient } from "../src/generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // clean up
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password", 12);
  const dummyImage = [
    "https://picsum.photos/seed/post1/600/400",
    "https://picsum.photos/seed/post2/600/400",
  ];

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      posts: {
        create: [
          {
            title: "First Blog Post",
            content:
              "This is the content of my first blog post. It contains some interesting information about web development.",
            topImage: dummyImage[0],
            published: true,
          },
          {
            title: "Second Blog Post",
            content:
              "This is the content of my second blog post. Here I share my thoughts on modern technology.",
            topImage: dummyImage[1],
            published: true,
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
