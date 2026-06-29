"use client";

import { useState, useEffect } from "react";

export default function Notes({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const key = `notes_${courseSlug}_${lessonSlug}`;

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setNote(stored);
  }, [key]);

  const save = () => {
    localStorage.setItem(key, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mt-6">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        📝 {isOpen ? "Masquer" : "Mes notes"}
        {note && !isOpen && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
      </button>
      {isOpen && (
        <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Prenez des notes sur cette leçon..."
            className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-y min-h-[100px] focus:outline-none"
            rows={4}
          />
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-400">{note.length} caractères</span>
            <button onClick={save} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {saved ? "✅ Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
