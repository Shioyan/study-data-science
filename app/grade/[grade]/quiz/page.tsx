import { notFound } from "next/navigation";
import { getQuizzesByGrade } from "@/lib/quizzes";
import type { Grade } from "@/lib/types";
import QuizPageClient from "./QuizPageClient";

const VALID_GRADES: Grade[] = ["grade3", "grade2", "pre-grade1"];

interface Props {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ topic?: string }>;
}

export function generateStaticParams() {
  return VALID_GRADES.map((grade) => ({ grade }));
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { grade: gradeParam } = await params;
  const { topic: topicParam } = await searchParams;

  if (!VALID_GRADES.includes(gradeParam as Grade)) {
    notFound();
  }

  const grade = gradeParam as Grade;
  const allQuestions = getQuizzesByGrade(grade);

  const questions = topicParam
    ? allQuestions.filter((q) => q.topic_id === topicParam)
    : allQuestions;

  return (
    <QuizPageClient
      grade={grade}
      questions={questions}
      topicFilter={topicParam ?? null}
    />
  );
}
