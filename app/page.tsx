import { getTopicsByGrade } from "@/lib/content";
import { getQuizzesByGrade } from "@/lib/quizzes";
import type { Grade, GradeSummary } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";
import GradeCard from "@/components/GradeCard";

const GRADES: Grade[] = ["grade3", "grade2", "pre-grade1"];

export default function HomePage() {
  const summaries: GradeSummary[] = GRADES.map((grade) => {
    const topics = getTopicsByGrade(grade);
    const quizzes = getQuizzesByGrade(grade);
    return {
      grade,
      topicCount: topics.length,
      quizCount: quizzes.length,
      // Progress は client-side で取得するため初期値 0
      completedTopics: 0,
      correctQuizzes: 0,
      answeredQuizzes: 0,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-indigo-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            統
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            統計学習アプリ
          </h1>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            統計検定を
            <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
              {" "}
              一緒に攻略しよう
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-lg mx-auto">
            学習テキストを読んで理解し、クイズで定着を確認。
            <br />
            進捗はブラウザに自動保存されます。
          </p>
        </div>

        {/* Grade cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <GradeCardWrapper key={summary.grade} summary={summary} />
          ))}
        </div>

        {/* How to use */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
            使い方
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "級を選ぶ",
                desc: "3級・2級・準1級から学習する級を選択します",
              },
              {
                step: "02",
                title: "テキストを読む",
                desc: "各トピックの解説テキストで概念を理解します",
              },
              {
                step: "03",
                title: "クイズで確認",
                desc: "4択クイズで理解度を確認し、弱点を把握します",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Server-rendered card — progress will be 0 on SSR (no localStorage on server)
function GradeCardWrapper({ summary }: { summary: GradeSummary }) {
  return <GradeCard grade={summary.grade} summary={summary} />;
}
