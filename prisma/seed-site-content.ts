import { PrismaClient } from "@prisma/client";
import { defaultSiteStats } from "../lib/data/site-stats";

const prisma = new PrismaClient();

async function main() {
  for (const stat of defaultSiteStats) {
    await prisma.siteStat.upsert({
      where: { key: stat.key },
      update: {},
      create: {
        key: stat.key,
        label: stat.label,
        value: stat.value,
        prefix: stat.prefix,
        suffix: stat.suffix,
        sortOrder: stat.sortOrder,
        published: true,
      },
    });
  }
  console.log(`✅ Seeded ${defaultSiteStats.length} editable site stats`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
