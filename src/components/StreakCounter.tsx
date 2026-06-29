"use client";

import { useEffect, useState } from "react";

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const dates: string[] = JSON.parse(localStorage.getItem("activityDates") || "[]");
    const today = new Date().toISOString().split("T")[0];

    // Add today if not already present
    if (!dates.includes(today)) {
      dates.push(today);
      localStorage.setItem("activityDates", JSON.stringify(dates));
    }

    // Calculate streak
    let count = 0;
    const sorted = [...dates].sort().reverse();
    const checkDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (sorted.includes(dateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(count);
  }, []);

  if (streak === 0) return null;

  return (
    <span className="text-xs text-orange-400 font-medium" title={`${streak} jour${streak > 1 ? "s" : ""} consécutif${streak > 1 ? "s" : ""}`}>
      🔥{streak}
    </span>
  );
}
