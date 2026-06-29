"use client";

import { useEffect, useState } from "react";
import { courses } from "@/lib/courses";

interface Skill {
  id: string;
  name: string;
  icon: string;
  progress: number;
  level: string;
}

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const calculated = courses.map((course) => {
      let completed = 0;
      course.lessons.forEach((l) => {
        if (localStorage.getItem(`progress_${course.slug}_${l.slug}`) === "true") completed++;
      });
      const pct = Math.round((completed / course.lessons.length) * 100);
      let level = "Novice";
      if (pct >= 100) level = "Maître";
      else if (pct >= 60) level = "Avancé";
      else if (pct >= 30) level = "Intermédiaire";
      else if (pct > 0) level = "Débutant";
      return { id: course.slug, name: course.title, icon: course.icon, progress: pct, level };
    });
    setSkills(calculated);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌳 Arbre de Compétences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{skill.icon}</span>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{skill.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{skill.level}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${skill.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            <span className="absolute top-2 right-2 text-xs text-gray-400">{skill.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
