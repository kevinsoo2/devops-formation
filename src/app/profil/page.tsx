"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { badges, getLevel, getUnlockedBadges, UserStats } from "@/lib/gamification";
import { courses } from "@/lib/courses";
import Link from "next/link";

export default function ProfilPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats>({ lessonsCompleted: 0, quizzesPassed: 0, perfectQuizzes: 0, streakDays: 0, totalXP: 0, coursesCompleted: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Calculate stats from localStorage
    let lessonsCompleted = 0;
    let quizzesPassed = 0;
    let perfectQuizzes = 0;
    const coursesCompleted: string[] = [];

    courses.forEach((course) => {
      let courseComplete = true;
      course.lessons.forEach((lesson) => {
        const key = `progress_${course.slug}_${lesson.slug}`;
        if (localStorage.getItem(key) === "true") {
          lessonsCompleted++;
        } else {
          courseComplete = false;
        }
        const quizKey = `quiz_${course.slug}_${lesson.slug}`;
        const quizData = localStorage.getItem(quizKey);
        if (quizData) {
          const { score, total } = JSON.parse(quizData);
          if (score > 0) quizzesPassed++;
          if (score === total) perfectQuizzes++;
        }
      });
      if (courseComplete && course.lessons.length > 0) coursesCompleted.push(course.slug);
    });

    // Streak
    const dates: string[] = JSON.parse(localStorage.getItem("activityDates") || "[]");
    let streakDays = 0;
    const sorted = [...dates].sort().reverse();
    const checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (sorted.includes(dateStr)) { streakDays++; checkDate.setDate(checkDate.getDate() - 1); }
      else if (i === 0) { checkDate.setDate(checkDate.getDate() - 1); }
      else break;
    }

    const totalXP = parseInt(localStorage.getItem("userXP") || "0");
    setStats({ lessonsCompleted, quizzesPassed, perfectQuizzes, streakDays, totalXP, coursesCompleted });
  }, []);

  if (!mounted) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-4xl animate-pulse">🚀</div></div>;

  const { level, progress, nextLevelXP } = getLevel(stats.totalXP);
  const unlockedBadges = getUnlockedBadges(stats);
  const lockedBadges = badges.filter((b) => !b.condition(stats));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl text-white">👤</div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {session?.user?.name || "Visiteur"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Niveau {level} — {stats.totalXP} XP</p>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{stats.totalXP} / {nextLevelXP} XP pour le niveau {level + 1}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl">🔥</div>
            <p className="text-sm font-bold text-orange-500">{stats.streakDays} jour{stats.streakDays > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow">
          <div className="text-3xl mb-1">📚</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lessonsCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Leçons terminées</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow">
          <div className="text-3xl mb-1">✅</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quizzesPassed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quiz réussis</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow">
          <div className="text-3xl mb-1">💯</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.perfectQuizzes}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quiz parfaits</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow">
          <div className="text-3xl mb-1">🏆</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesCompleted.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Parcours complets</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🏆 Badges ({unlockedBadges.length}/{badges.length})</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {unlockedBadges.map((badge) => (
            <div key={badge.id} className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700" title={badge.description}>
              <div className="text-2xl">{badge.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{badge.name}</p>
            </div>
          ))}
          {lockedBadges.map((badge) => (
            <div key={badge.id} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 opacity-40" title={badge.description}>
              <div className="text-2xl grayscale">🔒</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Progression par parcours</h2>
        <div className="space-y-4">
          {courses.map((course) => {
            const completed = 0;
            const pct = 0;
            return (
              <Link key={course.id} href={`/cours/${course.slug}`} className="block">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{course.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{course.title}</span>
                      <span className="text-gray-500 dark:text-gray-400">{course.lessons.length} leçons</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full bg-gradient-to-r ${course.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {!session && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-3">Connectez-vous pour sauvegarder votre progression entre appareils</p>
          <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Se connecter</Link>
        </div>
      )}
    </div>
  );
}
