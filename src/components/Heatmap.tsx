"use client";

import { useEffect, useState } from "react";

export default function Heatmap() {
  const [days, setDays] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const dates: string[] = JSON.parse(localStorage.getItem("activityDates") || "[]");
    const counts: { [key: string]: number } = {};
    dates.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
    setDays(counts);
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-700";
    if (count === 1) return "bg-green-200 dark:bg-green-900";
    if (count <= 3) return "bg-green-400 dark:bg-green-700";
    return "bg-green-600 dark:bg-green-500";
  };

  // Generate last 16 weeks (112 days)
  const today = new Date();
  const cells = [];
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    cells.push({ date: key, count: days[key] || 0 });
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📅 Activité (16 dernières semaines)</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
                title={`${day.date}: ${day.count} activité${day.count > 1 ? "s" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>Moins</span>
        <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
        <span>Plus</span>
      </div>
    </div>
  );
}
