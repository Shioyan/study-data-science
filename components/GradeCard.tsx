import Link from "next/link";
import { GRADE_LABELS, GRADE_DESCRIPTIONS } from "@/lib/types";
import type { Grade, GradeSummary } from "@/lib/types";
import ProgressBadge from "./ProgressBadge";

interface GradeCardProps {
  grade: Grade;
  summary: GradeSummary;
}

const GRADE_COLORS: Record<Grade, string> = {
  grade3:
    "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
  grade2:
    "from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600",
  "pre-grade1":
    "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
};

export default function GradeCard({ grade, summary }: GradeCardProps) {
  const topicPct =
    summary.topicCount === 0
      ? 0
      : Math.round((summary.completedTopics / summary.topicCount) * 100);

  const quizPct =
    summary.quizCount === 0
      ? 0
      : Math.round((summary.correctQuizzes / summary.quizCount) * 100);

  return (
    <Link href={`/grade/${grade}`} className="block group">
      <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header gradient */}
        <div
          className={`bg-gradient-to-br ${GRADE_COLORS[grade]} p-6 text-white`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold">{GRADE_LABELS[grade]}</span>
            <span className="text-sm bg-white/20 rounded-full px-3 py-1">
              統計検定
            </span>
          </div>
          <p className="text-sm text-white/80">{GRADE_DESCRIPTIONS[grade]}</p>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {summary.topicCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                トピック数
              </div>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {summary.quizCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                クイズ問題数
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <ProgressBadge
              completed={summary.completedTopics}
              total={summary.topicCount}
              label="学習進捗"
            />
            <ProgressBadge
              completed={summary.correctQuizzes}
              total={summary.quizCount}
              label="クイズ正解率"
            />
          </div>

          <div className="flex justify-end">
            <span className="text-xs text-indigo-500 group-hover:text-indigo-700 transition-colors">
              学習を始める →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
