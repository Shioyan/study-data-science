import fs from "fs";
import path from "path";
import type { QuizQuestion, Grade } from "./types";

const QUIZ_BASE = path.join(process.cwd(), "src/quizzes/statistics");

export function getQuizzesByGrade(grade: Grade): QuizQuestion[] {
  const dir = path.join(QUIZ_BASE, grade);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"));

  const questions: QuizQuestion[] = [];

  for (const filename of files) {
    const filepath = path.join(dir, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        questions.push(...data);
      } else if (data && typeof data === "object" && Array.isArray(data.questions)) {
        questions.push(...data.questions);
      }
    } catch (e) {
      console.warn(`Failed to parse quiz file: ${filepath}`, e);
    }
  }

  return questions;
}

export function getQuizzesByTopic(grade: Grade, topicId: string): QuizQuestion[] {
  return getQuizzesByGrade(grade).filter((q) => q.topic_id === topicId);
}
