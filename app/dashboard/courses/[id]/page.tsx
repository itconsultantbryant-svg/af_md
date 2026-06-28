"use client";

import { CourseLearningView } from "@/components/dashboard/CourseLearningView";

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <CourseLearningView enrollmentId={params.id} />
    </div>
  );
}
