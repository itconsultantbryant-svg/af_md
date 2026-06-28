import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { courses } from "../lib/data/training";
import { durationToHours } from "../lib/learning";

const prisma = new PrismaClient();

function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

const sampleQuestions = [
  {
    id: "q1",
    question: "What is artificial intelligence?",
    options: [
      "A physical robot only",
      "Technology that enables machines to simulate human intelligence",
      "A type of database",
      "A programming language",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    question: "Which is a common AI application in Africa?",
    options: ["Space exploration", "Agricultural forecasting", "Nuclear physics", "Deep sea mining"],
    correctIndex: 1,
  },
  {
    id: "q3",
    question: "What minimum score is required to pass an exam?",
    options: ["50%", "60%", "70%", "100%"],
    correctIndex: 2,
  },
];

async function seedCourseContent(courseId: string) {
  const existing = await prisma.courseSection.count({ where: { courseId } });
  if (existing > 0) return;

  const section1 = await prisma.courseSection.create({
    data: {
      courseId,
      title: "Introduction & Foundations",
      description: "Core concepts and overview",
      sortOrder: 0,
    },
  });

  await prisma.courseMaterial.createMany({
    data: [
      {
        sectionId: section1.id,
        title: "Welcome & Course Overview",
        type: "LINK",
        externalUrl: "https://www.afrimindai.com/training",
        durationMinutes: 10,
        sortOrder: 0,
      },
      {
        sectionId: section1.id,
        title: "Introduction Reading",
        type: "PDF",
        content: "Read the introductory materials to understand the course objectives and learning path.",
        durationMinutes: 20,
        sortOrder: 1,
      },
      {
        sectionId: section1.id,
        title: "Key Concepts Guide",
        type: "DOC",
        content: "Review the key concepts document covering fundamental principles.",
        durationMinutes: 25,
        sortOrder: 2,
      },
    ],
  });

  await prisma.sectionExam.create({
    data: {
      sectionId: section1.id,
      title: "Section 1 Assessment",
      questions: JSON.stringify(sampleQuestions),
      passingScore: 70,
    },
  });

  const section2 = await prisma.courseSection.create({
    data: {
      courseId,
      title: "Practical Application",
      description: "Hands-on learning and exercises",
      sortOrder: 1,
    },
  });

  await prisma.courseMaterial.createMany({
    data: [
      {
        sectionId: section2.id,
        title: "Video Tutorial",
        type: "VIDEO",
        content: "Watch the instructional video demonstrating practical techniques.",
        durationMinutes: 30,
        sortOrder: 0,
      },
      {
        sectionId: section2.id,
        title: "Visual Reference",
        type: "IMAGE",
        content: "Study the visual diagrams and reference materials.",
        durationMinutes: 15,
        sortOrder: 1,
      },
      {
        sectionId: section2.id,
        title: "Additional Resources",
        type: "LINK",
        externalUrl: "https://www.afrimindai.com/about",
        durationMinutes: 10,
        sortOrder: 2,
      },
    ],
  });

  await prisma.sectionExam.create({
    data: {
      sectionId: section2.id,
      title: "Section 2 Assessment",
      questions: JSON.stringify(sampleQuestions),
      passingScore: 70,
    },
  });

  await prisma.finalExam.create({
    data: {
      courseId,
      title: "Final Comprehensive Exam",
      questions: JSON.stringify([
        ...sampleQuestions,
        {
          id: "q4",
          question: "What is AfriMind Tech&AI Consulting Agency's mission?",
          options: [
            "Entertainment only",
            "AI built for Africa, trusted worldwide",
            "Hardware manufacturing",
            "Social media platform",
          ],
          correctIndex: 1,
        },
      ]),
      passingScore: 70,
    },
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@afrimindai.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@2026!";

  const adminHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminHash,
      firstName: "Admin",
      lastName: "AfriMind",
      role: "ADMIN",
      emailVerified: true,
      phoneVerified: true,
    },
  });

  let firstCourseId: string | null = null;

  for (const course of courses) {
    const seats = course.id === "youth-ai-camp" ? 20 : course.format === "Corporate" ? 15 : 25;
    const completionHours = durationToHours(course.duration);
    const dbCourse = await prisma.course.upsert({
      where: { slug: course.id },
      update: {
        title: course.title,
        description: course.description,
        duration: course.duration,
        completionHours,
        level: course.level,
        format: course.format,
        price: course.price,
        priceAmount: parsePrice(course.price),
        topics: JSON.stringify(course.topics),
        audiences: JSON.stringify(course.audiences),
        published: true,
      },
      create: {
        slug: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        completionHours,
        level: course.level,
        format: course.format,
        price: course.price,
        priceAmount: parsePrice(course.price),
        topics: JSON.stringify(course.topics),
        audiences: JSON.stringify(course.audiences),
        seatsTotal: seats,
        seatsAvailable: seats,
        published: true,
      },
    });

    if (!firstCourseId) firstCourseId = dbCourse.id;
  }

  if (firstCourseId) {
    await seedCourseContent(firstCourseId);
  }

  console.log(`✅ Seeded admin (${adminEmail}), ${courses.length} courses, and sample course content`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
