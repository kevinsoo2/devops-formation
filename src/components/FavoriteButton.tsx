"use client";

import { useEffect, useState } from "react";

interface FavoriteButtonProps {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
}

export default function FavoriteButton({ courseSlug, lessonSlug, lessonTitle }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFav(favs.some((f: { course: string; lesson: string }) => f.course === courseSlug && f.lesson === lessonSlug));
  }, [courseSlug, lessonSlug]);

  const toggle = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFav) {
      const updated = favs.filter((f: { course: string; lesson: string }) => !(f.course === courseSlug && f.lesson === lessonSlug));
      localStorage.setItem("favorites", JSON.stringify(updated));
    } else {
      favs.push({ course: courseSlug, lesson: lessonSlug, title: lessonTitle });
      localStorage.setItem("favorites", JSON.stringify(favs));
    }
    setIsFav(!isFav);
  };

  return (
    <button onClick={toggle} title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"} className={`p-2 rounded-lg transition-colors ${isFav ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
      <svg className="w-5 h-5" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>
  );
}
