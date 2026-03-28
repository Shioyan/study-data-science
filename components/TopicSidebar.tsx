"use client";

import type { Topic, Grade } from "@/lib/types";

interface TopicSidebarProps {
  grade: Grade;
  topics: Topic[];
  selectedTopicId: string | null;
  completedTopicIds: Set<string>;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicSidebar({
  topics,
  selectedTopicId,
  completedTopicIds,
  onSelectTopic,
}: TopicSidebarProps) {
  return (
    <aside className="flex flex-col w-36 sm:w-48 lg:w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
          トピック一覧
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {topics.filter((t) => completedTopicIds.has(t.topic_id)).length} /{" "}
          {topics.length} 完了
        </p>
      </div>
      <nav className="space-y-1 p-1 sm:p-2">
        {topics.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 p-3 text-center">
            トピックがまだありません
          </p>
        ) : (
          topics.map((topic) => {
            const isCompleted = completedTopicIds.has(topic.topic_id);
            const isSelected = selectedTopicId === topic.topic_id;

            return (
              <button
                key={topic.topic_id}
                onClick={() => onSelectTopic(topic.topic_id)}
                className={`w-full text-left px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all duration-150 flex items-start gap-1.5 sm:gap-2 ${
                  isSelected
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isCompleted && "✓"}
                </span>
                <span className="leading-snug">{topic.title}</span>
              </button>
            );
          })
        )}
      </nav>
    </aside>
  );
}
