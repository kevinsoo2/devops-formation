"use client";

import { useState, useRef, useEffect } from "react";
import { courses, Lesson } from "@/lib/courses";

interface SearchResult {
  course: string;
  courseSlug: string;
  lesson: Lesson;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); setIsOpen(false); return; }
    const lower = q.toLowerCase();
    const found: SearchResult[] = [];
    courses.forEach((course) => {
      course.lessons.forEach((lesson) => {
        if (lesson.title.toLowerCase().includes(lower) || lesson.description.toLowerCase().includes(lower) || course.title.toLowerCase().includes(lower)) {
          found.push({ course: course.title, courseSlug: course.slug, lesson });
        }
      });
    });
    setResults(found.slice(0, 8));
    setIsOpen(true);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher un cours..." className="w-48 md:w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-400" />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <a key={i} href={`/cours/${r.courseSlug}/${r.lesson.slug}`} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0" onClick={() => setIsOpen(false)}>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{r.lesson.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.course}</p>
              </div>
            </a>
          ))}
        </div>
      )}
      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucun résultat pour &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
