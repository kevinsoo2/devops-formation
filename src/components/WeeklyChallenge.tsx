"use client";

import { useEffect, useState } from "react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  type: "lessons" | "quizzes" | "perfect";
  reward: number;
}

const challenges: Challenge[] = [
  { id: "w1", title: "Explorateur", description: "Terminez 3 leçons cette semaine", target: 3, type: "lessons", reward: 150 },
  { id: "w2", title: "Quiz Master", description: "Réussissez 5 quiz cette semaine", target: 5, type: "quizzes", reward: 200 },
  { id: "w3", title: "Perfectionniste", description: "Obtenez 100% à 2 quiz", target: 2, type: "perfect", reward: 250 },
];

export default function WeeklyChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const challenge = challenges[weekNum % challenges.length];
    setCurrentChallenge(challenge);

    // Calculate progress from localStorage
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let count = 0;
    if (challenge.type === "lessons") {
      const dates: string[] = JSON.parse(localStorage.getItem("activityDates") || "[]");
      count = dates.filter((d) => new Date(d) >= weekStart).length;
    }
    setProgress(Math.min(count, challenge.target));
  }, []);

  if (!currentChallenge) return null;

  const pct = Math.round((progress / currentChallenge.target) * 100);
  const completed = progress >= currentChallenge.target;

  return (
    <div className={`rounded-xl p-4 border ${completed ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700" : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700"}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
          🎯 Défi de la semaine
        </h4>
        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">+{currentChallenge.reward} XP</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{currentChallenge.description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all ${completed ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{progress}/{currentChallenge.target}</span>
        {completed && <span>✅</span>}
      </div>
    </div>
  );
}
