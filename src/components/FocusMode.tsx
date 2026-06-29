"use client";

import { useState, useEffect } from "react";

export default function FocusMode() {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    if (focused) {
      nav?.classList.add("hidden");
      footer?.classList.add("hidden");
    } else {
      nav?.classList.remove("hidden");
      footer?.classList.remove("hidden");
    }
    return () => {
      nav?.classList.remove("hidden");
      footer?.classList.remove("hidden");
    };
  }, [focused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "f" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setFocused((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <button onClick={() => setFocused(!focused)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${focused ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`} title="Mode focus (Ctrl+Shift+F)">
      {focused ? "🔓 Quitter focus" : "🎯 Focus"}
    </button>
  );
}
