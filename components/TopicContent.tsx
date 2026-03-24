"use client";

import "katex/dist/katex.min.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import type { Topic, Grade } from "@/lib/types";
import { getTopicProgress, markTopicCompleted, markTopicIncomplete } from "@/lib/progress";

interface TopicContentProps {
  grade: Grade;
  topic: Topic;
  onProgressChange?: () => void;
}

export default function TopicContent({
  grade,
  topic,
  onProgressChange,
}: TopicContentProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const prog = getTopicProgress(grade, topic.topic_id);
    setIsCompleted(prog.completed);
  }, [grade, topic.topic_id]);

  function handleToggleComplete() {
    if (isCompleted) {
      markTopicIncomplete(grade, topic.topic_id);
      setIsCompleted(false);
    } else {
      markTopicCompleted(grade, topic.topic_id);
      setIsCompleted(true);
    }
    onProgressChange?.();
  }

  return (
    <article className="flex-1 overflow-y-auto">
      {/* Topic header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {topic.title}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            topic_id: {topic.topic_id}
          </p>
        </div>
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isCompleted
              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400"
          }`}
        >
          {isCompleted ? (
            <>
              <span className="text-green-500">✓</span> 学習済み
            </>
          ) : (
            <>
              <span>○</span> 完了にする
            </>
          )}
        </button>
      </div>

      {/* Markdown content */}
      <div className="px-6 py-8 max-w-3xl">
        <div className="prose prose-indigo dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
          >
            {topic.content}
          </ReactMarkdown>
        </div>

        {/* Link to quiz */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/grade/${grade}/quiz?topic=${topic.topic_id}`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            このトピックのクイズを解く →
          </Link>
        </div>
      </div>
    </article>
  );
}
