"use client";

import Link from "next/link";
import type { Grade } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";

interface QuizResultsProps {
  grade: Grade;
  correct: number;
  total: number;
  onRetry: () => void;
}

export default function QuizResults({
  grade,
  correct,
  total,
  onRetry,
}: QuizResultsProps) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  let message = "";
  let messageColor = "";
  if (pct >= 90) {
    message = "素晴らしい！完璧に近い理解です。";
    messageColor = "text-green-600 dark:text-green-400";
  } else if (pct >= 70) {
    message = "よくできました！引き続き復習しましょう。";
    messageColor = "text-indigo-600 dark:text-indigo-400";
  } else if (pct >= 50) {
    message = "もう少し！テキストを見直してから再挑戦してみましょう。";
    messageColor = "text-yellow-600 dark:text-yellow-400";
  } else {
    message = "テキストを読み直してから再挑戦してみましょう。";
    messageColor = "text-red-600 dark:text-red-400";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10 max-w-md w-full">
        <div className="text-6xl mb-4">
          {pct >= 90 ? "🏆" : pct >= 70 ? "🎉" : pct >= 50 ? "📚" : "💪"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          クイズ完了！
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {GRADE_LABELS[grade]}
        </p>

        {/* Score ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
              strokeLinecap="round"
              className="text-indigo-500 transition-all duration-700"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {pct}%
            </span>
            <span className="text-xs text-gray-500">
              {correct}/{total}
            </span>
          </div>
        </div>

        <p className={`font-medium mb-8 ${messageColor}`}>{message}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            もう一度挑戦する
          </button>
          <Link
            href={`/grade/${grade}`}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg text-sm transition-colors text-center"
          >
            テキストに戻る
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            トップページへ
          </Link>
        </div>
      </div>
    </div>
  );
}
