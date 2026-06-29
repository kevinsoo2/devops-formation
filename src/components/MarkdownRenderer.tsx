"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200 prose-blockquote:py-1 prose-blockquote:px-4 prose-th:text-gray-900 dark:prose-th:text-white prose-td:text-gray-700 dark:prose-td:text-gray-200 prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-hr:border-gray-200 dark:prose-hr:border-gray-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
