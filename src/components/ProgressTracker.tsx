"use client";

import { useEffect, useState } from "react";

interface ProgressTrackerProps {
  courseSlug: string;
  lessonSlug: string;
}

export default function ProgressTracker({ courseSlug, lessonSlug }: ProgressTrackerProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const key = `progress_${courseSlug}_${lessonSlug}`;
    setCompleted(localStorage.getItem(key) === "true");
  }, [courseSlug, lessonSlug]);

  const toggleComplete = () => {
    const key = `progress_${courseSlug}_${lessonSlug}`;
    const newValue = !completed;
    localStorage.setItem(key, String(newValue));
    setCompleted(newValue);

    // Award XP when completing a lesson
    if (newValue) {
      const currentXP = parseInt(localStorage.getItem("userXP") || "0");
      localStorage.setItem("userXP", String(currentXP + 50));
      // Track activity date for streak
      const dates: string[] = JSON.parse(localStorage.getItem("activityDates") || "[]");
      const today = new Date().toISOString().split("T")[0];
      if (!dates.includes(today)) {
        dates.push(today);
        localStorage.setItem("activityDates", JSON.stringify(dates));
      }
    }
  };

  return (
    <button onClick={toggleComplete} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${completed ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"}`}>
      {completed ? (
        <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Leçon terminée</>
      ) : (
        <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg> Marquer comme terminée</>
      )}
    </button>
  );
}
