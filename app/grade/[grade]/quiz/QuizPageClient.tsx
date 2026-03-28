"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import QuizCard from "@/components/QuizCard";
import QuizResults from "@/components/QuizResults";
import type { QuizQuestion, Grade } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";
import { recordQuizAnswer } from "@/lib/progress";

interface QuizPageClientProps {
  grade: Grade;
  questions: QuizQuestion[];
  topicFilter: string | null;
}

interface AnswerState {
  selectedOption: number | null;
  isAnswered: boolean;
}

export default function QuizPageClient({
  grade,
  questions: allQuestions,
  topicFilter,
}: QuizPageClientProps) {
  function pickRandom(src: QuizQuestion[]) {
    return [...src].sort(() => Math.random() - 0.5).slice(0, Math.min(10, src.length));
  }

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => pickRandom(allQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    () => questions.map(() => ({ selectedOption: null, isAnswered: false }))
  );
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  const correctCount = answers.filter(
    (a, i) => a.isAnswered && a.selectedOption === questions[i].correct
  ).length;

  function handleSelectOption(optionIndex: number) {
    if (currentAnswer.isAnswered) return;

    const isCorrect = optionIndex === currentQuestion.correct;
    recordQuizAnswer(grade, currentQuestion.id, isCorrect, optionIndex);

    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = { selectedOption: optionIndex, isAnswered: true };
      return next;
    });
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function handleRetry() {
    const newQuestions = pickRandom(allQuestions);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAnswers(newQuestions.map(() => ({ selectedOption: null, isAnswered: false })));
    setIsFinished(false);
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 bg-indigo-50 dark:bg-gray-950">
        <div className="text-5xl">📝</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          クイズ問題がありません
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
            src/quizzes/statistics/{grade}/
          </code>{" "}
          にJSONファイルを追加すると、ここに問題が表示されます。
        </p>
        <Link
          href={`/grade/${grade}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          テキストに戻る
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-gray-950 py-12">
        <div className="max-w-lg mx-auto px-4">
          <QuizResults
            grade={grade}
            correct={correctCount}
            total={questions.length}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-indigo-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            トップ
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <Link
            href={`/grade/${grade}`}
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            {GRADE_LABELS[grade]}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            クイズ
          </span>
          {topicFilter && (
            <span className="text-gray-400 text-xs ml-1">
              ({topicFilter})
            </span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-1 bg-indigo-500 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Quiz content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedOption={currentAnswer.selectedOption}
            isAnswered={currentAnswer.isAnswered}
            onSelectOption={handleSelectOption}
          />
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← 前の問題
          </button>

          <div className="text-sm text-gray-400">
            正解: {correctCount} / {answers.filter((a) => a.isAnswered).length} 問
          </div>

          {currentAnswer.isAnswered ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              {currentIndex === questions.length - 1
                ? "結果を見る"
                : "次の問題 →"}
            </button>
          ) : (
            <button
              disabled
              className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            >
              次の問題 →
            </button>
          )}
        </div>

        {/* Related text link (when wrong) */}
        {currentAnswer.isAnswered &&
          currentAnswer.selectedOption !== currentQuestion?.correct &&
          currentQuestion?.related_section && (
            <div className="mt-4 text-center">
              <Link
                href={currentQuestion.related_section}
                className="text-sm text-indigo-500 hover:text-indigo-700 underline"
              >
                関連テキストで復習する →
              </Link>
            </div>
          )}
      </main>
    </div>
  );
}
