"use client";

import { useState } from "react";
import type { Topic, Grade } from "@/lib/types";
import { GRADE_LABELS } from "@/lib/types";

interface TopicSidebarProps {
  grade: Grade;
  topics: Topic[];
  selectedTopicId: string | null;
  completedTopicIds: Set<string>;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicSidebar({
  grade,
  topics,
  selectedTopicId,
  completedTopicIds,
  onSelectTopic,
}: TopicSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <nav className="space-y-1 p-2">
      {topics.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 p-3 text-center">
          トピックがまだありません
        </p>
      ) : (
        topics.map((topic) => {
          const isCompleted = completedTopicIds.has(topic.topic_id);
          const isSelected = selectedTopicId === topic.topic_id;

          return (
            <button
              key={topic.topic_id}
              onClick={() => {
                onSelectTopic(topic.topic_id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 flex items-start gap-2 ${
                isSelected
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {/* Completion indicator */}
              <span
                className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
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
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
          aria-label="トピック一覧を開く"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {topics.find((t) => t.topic_id === selectedTopicId)?.title ??
            "トピックを選択"}
        </span>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-20 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-white dark:bg-gray-800 h-full shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {GRADE_LABELS[grade]} — トピック一覧
              </h2>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
            トピック一覧
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {topics.filter((t) => completedTopicIds.has(t.topic_id)).length} /{" "}
            {topics.length} 完了
          </p>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
