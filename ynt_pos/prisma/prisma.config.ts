// prisma.config.ts

import { defineConfig, env } from "prisma/config";

console.log("CWD:", process.cwd());
console.log("DATABASE_URL seen by Prisma config:", process.env.DATABASE_URL);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: 'prisma/migrations',
  },
});
