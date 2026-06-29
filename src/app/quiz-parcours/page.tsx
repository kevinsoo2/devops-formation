"use client";

import { useState } from "react";
import { courses } from "@/lib/courses";
import Link from "next/link";

interface Answer {
  question: string;
  options: string[];
  weights: { [courseSlug: string]: number }[];
}

const quizData: Answer[] = [
  {
    question: "Quel est votre objectif principal ?",
    options: ["Automatiser des serveurs", "Déployer des apps en conteneurs", "Surveiller des systèmes", "Gérer de l'infrastructure cloud"],
    weights: [{ ansible: 3, redhat: 2 }, { kubernetes: 3, docker: 3 }, { prometheus: 3 }, { terraform: 3, cicd: 2 }],
  },
  {
    question: "Quel est votre niveau en Linux ?",
    options: ["Débutant", "Intermédiaire", "Avancé", "Expert"],
    weights: [{ redhat: 3, linux: 3 }, { ansible: 2, docker: 2 }, { kubernetes: 2, terraform: 2 }, { gitops: 3, cicd: 2 }],
  },
  {
    question: "Que préférez-vous faire ?",
    options: ["Écrire du code/scripts", "Configurer des systèmes", "Concevoir des architectures", "Résoudre des problèmes"],
    weights: [{ cicd: 3, linux: 2 }, { ansible: 3, redhat: 2 }, { kubernetes: 3, terraform: 3 }, { prometheus: 3, linux: 3 }],
  },
  {
    question: "Dans quel environnement travaillez-vous ?",
    options: ["Startup / Petit projet", "Entreprise classique", "Cloud-native", "Multi-cloud / Hybride"],
    weights: [{ docker: 3, cicd: 2 }, { redhat: 3, ansible: 2 }, { kubernetes: 3, gitops: 3 }, { terraform: 3, gitops: 2 }],
  },
];

export default function QuizParcoursPage() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [finished, setFinished] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newScores = { ...scores };
    const weights = quizData[current].weights[optionIndex];
    Object.entries(weights).forEach(([slug, weight]) => {
      newScores[slug] = (newScores[slug] || 0) + weight;
    });
    setScores(newScores);

    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const getRecommendations = () => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([slug]) => courses.find((c) => c.slug === slug))
      .filter(Boolean);
  };

  if (finished) {
    const recommendations = getRecommendations();
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vos parcours recommandés</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Basé sur vos réponses, voici les parcours qui vous correspondent le mieux :</p>
          <div className="space-y-4">
            {recommendations.map((course, i) => course && (
              <Link key={course.slug} href={`/cours/${course.slug}`} className="block">
                <div className={`flex items-center gap-4 p-4 rounded-lg border-2 ${i === 0 ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                  <span className="text-3xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                  <span className="text-3xl">{course.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => { setCurrent(0); setScores({}); setFinished(false); }} className="mt-6 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
            Refaire le quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">🧭 Quel parcours choisir ?</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{current + 1}/{quizData.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((current + 1) / quizData.length) * 100}%` }} />
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">{quizData[current].question}</p>
        <div className="space-y-3">
          {quizData[current].options.map((option, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 transition-colors text-gray-700 dark:text-gray-200">
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
