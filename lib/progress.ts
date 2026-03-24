import type {
  AppProgress,
  GradeProgress,
  TopicProgress,
  QuizProgress,
  Grade,
} from "./types";

const STORAGE_KEY = "study-data-science-progress";

function createEmptyGradeProgress(): GradeProgress {
  return { topics: {}, quizzes: {} };
}

export function loadProgress(): AppProgress {
  if (typeof window === "undefined") {
    return {
      grade3: createEmptyGradeProgress(),
      grade2: createEmptyGradeProgress(),
      "pre-grade1": createEmptyGradeProgress(),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no data");
    const parsed = JSON.parse(raw) as AppProgress;
    // ensure all grades exist
    if (!parsed.grade3) parsed.grade3 = createEmptyGradeProgress();
    if (!parsed.grade2) parsed.grade2 = createEmptyGradeProgress();
    if (!parsed["pre-grade1"]) parsed["pre-grade1"] = createEmptyGradeProgress();
    return parsed;
  } catch {
    return {
      grade3: createEmptyGradeProgress(),
      grade2: createEmptyGradeProgress(),
      "pre-grade1": createEmptyGradeProgress(),
    };
  }
}

function saveProgress(progress: AppProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getTopicProgress(grade: Grade, topicId: string): TopicProgress {
  const progress = loadProgress();
  return progress[grade].topics[topicId] ?? { completed: false };
}

export function markTopicCompleted(grade: Grade, topicId: string): void {
  const progress = loadProgress();
  progress[grade].topics[topicId] = {
    completed: true,
    completedAt: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function markTopicIncomplete(grade: Grade, topicId: string): void {
  const progress = loadProgress();
  progress[grade].topics[topicId] = { completed: false };
  saveProgress(progress);
}

export function getQuizProgress(grade: Grade, questionId: string): QuizProgress {
  const progress = loadProgress();
  return (
    progress[grade].quizzes[questionId] ?? {
      answered: false,
      correct: false,
    }
  );
}

export function recordQuizAnswer(
  grade: Grade,
  questionId: string,
  correct: boolean,
  selectedOption: number
): void {
  const progress = loadProgress();
  progress[grade].quizzes[questionId] = {
    answered: true,
    correct,
    selectedOption,
    answeredAt: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function getGradeStats(grade: Grade) {
  const progress = loadProgress();
  const gradeProgress = progress[grade];

  const completedTopics = Object.values(gradeProgress.topics).filter(
    (t) => t.completed
  ).length;

  const answeredQuizzes = Object.values(gradeProgress.quizzes).filter(
    (q) => q.answered
  ).length;

  const correctQuizzes = Object.values(gradeProgress.quizzes).filter(
    (q) => q.answered && q.correct
  ).length;

  return { completedTopics, answeredQuizzes, correctQuizzes };
}

export function resetGradeProgress(grade: Grade): void {
  const progress = loadProgress();
  progress[grade] = createEmptyGradeProgress();
  saveProgress(progress);
}
