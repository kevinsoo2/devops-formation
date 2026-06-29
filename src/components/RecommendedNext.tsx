"use client";

import { useEffect, useState } from "react";
import { courses, Lesson } from "@/lib/courses";
import Link from "next/link";

interface Recommendation {
  courseSlug: string;
  courseIcon: string;
  courseTitle: string;
  lesson: Lesson;
}

export default function RecommendedNext() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const recs: Recommendation[] = [];
    courses.forEach((course) => {
      for (const lesson of course.lessons) {
        if (localStorage.getItem(`progress_${course.slug}_${lesson.slug}`) !== "true") {
          recs.push({ courseSlug: course.slug, courseIcon: course.icon, courseTitle: course.title, lesson });
          break;
        }
      }
    });
    setRecommendations(recs.slice(0, 3));
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎯 Prochaines leçons recommandées</h3>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Link key={`${rec.courseSlug}-${rec.lesson.slug}`} href={`/cours/${rec.courseSlug}/${rec.lesson.slug}`} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-2xl">{rec.courseIcon}</span>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900 dark:text-white">{rec.lesson.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{rec.courseTitle}</p>
            </div>
            <span className="text-blue-500 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
