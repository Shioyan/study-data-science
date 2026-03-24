"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopicSidebar from "@/components/TopicSidebar";
import TopicContent from "@/components/TopicContent";
import type { Topic, Grade } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";
import { loadProgress } from "@/lib/progress";

interface GradePageClientProps {
  grade: Grade;
  topics: Topic[];
  initialTopicId: string | null;
}

export default function GradePageClient({
  grade,
  topics,
  initialTopicId,
}: GradePageClientProps) {
  const router = useRouter();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    initialTopicId
  );
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(
    new Set()
  );

  const refreshProgress = useCallback(() => {
    const progress = loadProgress();
    const completed = new Set(
      Object.entries(progress[grade].topics)
        .filter(([, v]) => v.completed)
        .map(([k]) => k)
    );
    setCompletedTopicIds(completed);
  }, [grade]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const selectedTopic =
    topics.find((t) => t.topic_id === selectedTopicId) ?? null;

  function handleSelectTopic(topicId: string) {
    setSelectedTopicId(topicId);
    router.replace(`/grade/${grade}?topic=${topicId}`, { scroll: false });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navigation */}
      <header className="border-b border-indigo-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-gray-400 hover:text-indigo-500 transition-colors"
          >
            トップ
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            {GRADE_LABELS[grade]}
          </span>
          <div className="ml-auto">
            <Link
              href={`/grade/${grade}/quiz`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              クイズに挑戦
            </Link>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <TopicSidebar
          grade={grade}
          topics={topics}
          selectedTopicId={selectedTopicId}
          completedTopicIds={completedTopicIds}
          onSelectTopic={handleSelectTopic}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          {selectedTopic ? (
            <TopicContent
              grade={grade}
              topic={selectedTopic}
              onProgressChange={refreshProgress}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <div className="text-5xl">📖</div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {topics.length === 0
                  ? "まだトピックがありません"
                  : "トピックを選択してください"}
              </h2>
              {topics.length === 0 && (
                <p className="text-sm text-gray-400 max-w-md">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                    src/content/statistics/{grade}/
                  </code>{" "}
                  にMarkdownファイルを追加すると、ここに表示されます。
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
