import { notFound } from "next/navigation";
import { getTopicsByGrade } from "@/lib/content";
import type { Grade } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";
import GradePageClient from "./GradePageClient";

const VALID_GRADES: Grade[] = ["grade3", "grade2", "pre-grade1"];

interface Props {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ topic?: string }>;
}

export function generateStaticParams() {
  return VALID_GRADES.map((grade) => ({ grade }));
}

export default async function GradePage({ params, searchParams }: Props) {
  const { grade: gradeParam } = await params;
  const { topic: topicParam } = await searchParams;

  if (!VALID_GRADES.includes(gradeParam as Grade)) {
    notFound();
  }

  const grade = gradeParam as Grade;
  const topics = getTopicsByGrade(grade);
  const initialTopicId = topicParam ?? topics[0]?.topic_id ?? null;

  return (
    <GradePageClient
      grade={grade}
      topics={topics}
      initialTopicId={initialTopicId}
    />
  );
}
