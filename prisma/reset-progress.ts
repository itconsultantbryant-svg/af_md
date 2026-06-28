import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const deletedAttempts = await prisma.examAttempt.deleteMany();
  const deletedProgress = await prisma.materialProgress.deleteMany();

  const resetEnrollments = await prisma.enrollment.updateMany({
    data: {
      completionPercent: 0,
      averageScore: null,
      completed: false,
      completedAt: null,
      certificateNumber: null,
      certificateUrl: null,
      currentSectionId: null,
    },
  });

  console.log(`✅ Reset complete:`);
  console.log(`   - ${deletedAttempts.count} exam attempts deleted`);
  console.log(`   - ${deletedProgress.count} material progress records deleted`);
  console.log(`   - ${resetEnrollments.count} enrollments reset to 0% progress`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
