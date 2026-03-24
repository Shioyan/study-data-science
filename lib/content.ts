import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Topic, TopicFrontmatter, Grade } from "./types";

const CONTENT_BASE = path.join(process.cwd(), "src/content/statistics");

export function getTopicsByGrade(grade: Grade): Topic[] {
  const dir = path.join(CONTENT_BASE, grade);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const topics: Topic[] = files.map((filename) => {
    const filepath = path.join(dir, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    const frontmatter = data as TopicFrontmatter;
    const slug = filename.replace(/\.(md|mdx)$/, "");

    return {
      title: frontmatter.title || slug,
      grade: frontmatter.grade || grade,
      topic_id: frontmatter.topic_id || slug,
      order: frontmatter.order ?? 999,
      content,
      slug,
    };
  });

  // order フィールドでソート
  return topics.sort((a, b) => a.order - b.order);
}

export function getTopicById(grade: Grade, topicId: string): Topic | null {
  const topics = getTopicsByGrade(grade);
  return topics.find((t) => t.topic_id === topicId) ?? null;
}
