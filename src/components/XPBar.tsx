"use client";

import { useEffect, useState } from "react";
import { getLevel } from "@/lib/gamification";

export default function XPBar() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("userXP");
    if (stored) setXp(parseInt(stored));
  }, []);

  const { level, progress } = getLevel(xp);

  if (xp === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-yellow-400 font-bold">⚡Nv.{level}</span>
      <div className="w-16 bg-gray-700 rounded-full h-2">
        <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-gray-400">{xp}XP</span>
    </div>
  );
}
