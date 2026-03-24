"use client";

import type { QuizQuestion } from "@/lib/types";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  isAnswered: boolean;
  onSelectOption: (index: number) => void;
}

const DIFFICULTY_COLORS = {
  基礎: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  標準: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  応用: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isAnswered,
  onSelectOption,
}: QuizCardProps) {
  const isCorrect =
    isAnswered && selectedOption === question.correct;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          問題 {questionNumber} / {totalQuestions}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            DIFFICULTY_COLORS[question.difficulty]
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="px-6 py-5">
        <p className="text-gray-900 dark:text-white font-medium leading-relaxed text-base">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="px-6 pb-5 space-y-2.5">
        {question.options.map((option, idx) => {
          let optionStyle =
            "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";

          if (isAnswered) {
            if (idx === question.correct) {
              optionStyle =
                "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
            } else if (idx === selectedOption) {
              optionStyle =
                "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
            } else {
              optionStyle =
                "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-60";
            }
          } else if (idx === selectedOption) {
            optionStyle =
              "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300";
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswered && onSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 flex items-start gap-3 ${optionStyle} ${
                isAnswered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="font-bold flex-shrink-0 mt-0.5">
                {["A", "B", "C", "D"][idx]}.
              </span>
              <span>{option}</span>
              {isAnswered && idx === question.correct && (
                <span className="ml-auto flex-shrink-0 text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
              )}
              {isAnswered && idx === selectedOption && idx !== question.correct && (
                <span className="ml-auto flex-shrink-0 text-red-500 font-bold">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation (after answer) */}
      {isAnswered && (
        <div
          className={`mx-6 mb-6 p-4 rounded-xl text-sm ${
            isCorrect
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          }`}
        >
          <p
            className={`font-semibold mb-1 ${
              isCorrect
                ? "text-green-700 dark:text-green-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {isCorrect ? "正解！" : "不正解"}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {question.explanation}
          </p>
          {/* Wrong explanation for selected option */}
          {!isCorrect &&
            selectedOption !== null &&
            question.wrong_explanations?.[String(selectedOption)] && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs border-t border-amber-200 dark:border-amber-700 pt-2">
                <span className="font-medium">選択肢{["A", "B", "C", "D"][selectedOption]}について：</span>{" "}
                {question.wrong_explanations[String(selectedOption)]}
              </p>
            )}
        </div>
      )}
    </div>
  );
}
