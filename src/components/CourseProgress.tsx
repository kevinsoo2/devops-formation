"use client";

import { useEffect, useState } from "react";
import { Course } from "@/lib/courses";

export default function CourseProgress({ course }: { course: Course }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let completed = 0;
    course.lessons.forEach((lesson) => {
      const key = `progress_${course.slug}_${lesson.slug}`;
      if (localStorage.getItem(key) === "true") completed++;
    });
    setProgress(Math.round((completed / course.lessons.length) * 100));
  }, [course]);

  if (progress === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>Progression</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
