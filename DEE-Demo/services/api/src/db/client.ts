import { PrismaClient } from '@prisma/client';

// Avoid creating multiple PrismaClient instances in dev with hot-reload
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prisma = globalThis.prismaGlobal || new PrismaClient({
  log: ['warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;


