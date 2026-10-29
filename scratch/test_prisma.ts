import { prisma } from '../lib/prisma';

async function main() {
  const images = await prisma.image.findMany();
  console.log(images);
}

main().catch(console.error);
