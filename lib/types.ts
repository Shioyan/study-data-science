// Grade types
export type Grade = "grade3" | "grade2" | "pre-grade1";

export const GRADE_LABELS: Record<Grade, string> = {
  grade3: "3級",
  grade2: "2級",
  "pre-grade1": "準1級",
};

export const GRADE_DESCRIPTIONS: Record<Grade, string> = {
  grade3: "データの基本的な扱い方・記述統計",
  grade2: "推測統計・確率・統計的推測",
  "pre-grade1": "多変量解析・時系列分析・ベイズ統計",
};

// Topic (from Markdown frontmatter)
export interface TopicFrontmatter {
  title: string;
  grade: Grade;
  topic_id: string;
  order: number;
}

export interface Topic extends TopicFrontmatter {
  content: string;
  slug: string; // ファイル名（拡張子なし）
}

// Quiz question
export interface QuizQuestion {
  id: string;
  grade: Grade;
  topic_id: string; // 対応するMarkdownファイルのID（例: "01_data-types"）
  question: string; // 問題文
  options: string[]; // 選択肢（4つ）
  correct: number; // 正解のインデックス（0-3）
  explanation: string; // 正解の解説
  wrong_explanations: {
    // 不正解の選択肢ごとの解説
    [key: string]: string;
  };
  difficulty: "基礎" | "標準" | "応用";
  related_section: string; // 関連テキストへのリンク（例: "/grade/grade3?topic=01_data-types"）
}

// Progress types (stored in localStorage)
export interface TopicProgress {
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface QuizProgress {
  answered: boolean;
  correct: boolean;
  answeredAt?: string;
  selectedOption?: number;
}

export interface GradeProgress {
  topics: Record<string, TopicProgress>; // key: topic_id
  quizzes: Record<string, QuizProgress>; // key: quiz question id
}

export interface AppProgress {
  grade3: GradeProgress;
  grade2: GradeProgress;
  "pre-grade1": GradeProgress;
}

// UI state
export interface GradeSummary {
  grade: Grade;
  topicCount: number;
  quizCount: number;
  completedTopics: number;
  correctQuizzes: number;
  answeredQuizzes: number;
}
