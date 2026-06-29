"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/quizzes";
import Confetti from "./Confetti";

interface QuizProps {
  questions: QuizQuestion[];
  courseSlug: string;
  lessonSlug: string;
}

export default function Quiz({ questions, courseSlug, lessonSlug }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      // Save completion to localStorage
      if (typeof window !== "undefined") {
        const key = `quiz_${courseSlug}_${lessonSlug}`;
        localStorage.setItem(key, JSON.stringify({ score: score + (selected === question.correctIndex ? 1 : 0), total: questions.length }));
      }
    }
  };

  if (finished) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    // Award XP
    if (typeof window !== "undefined") {
      const currentXP = parseInt(localStorage.getItem("userXP") || "0");
      let xpGained = 30; // Quiz pass
      if (percentage === 100) xpGained = 100; // Perfect quiz
      localStorage.setItem("userXP", String(currentXP + xpGained));
    }

    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600">
        <Confetti trigger={percentage === 100} />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz terminé !</h3>
        <div className="text-center">
          <div className={`text-5xl font-bold mb-2 ${percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"}`}>
            {percentage}%
          </div>
          <p className="text-gray-600 dark:text-gray-300">{finalScore}/{questions.length} bonnes réponses</p>
          <p className="mt-4 text-lg">
            {percentage >= 70 ? "Excellent ! Vous maîtrisez ce sujet." : percentage >= 50 ? "Pas mal ! Relisez les points manqués." : "Continuez à étudier, vous progressez !"}
          </p>
          <button onClick={() => { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false); }} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Question {currentQ + 1}/{questions.length}</span>
      </div>
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{question.question}</p>
      <div className="space-y-3">
        {question.options.map((option, i) => {
          let cls = "p-3 rounded-lg border-2 cursor-pointer transition-all text-left w-full ";
          if (!showResult) {
            cls += selected === i ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400";
          } else if (i === question.correctIndex) {
            cls += "border-green-500 bg-green-50 dark:bg-green-900/30";
          } else if (i === selected) {
            cls += "border-red-500 bg-red-50 dark:bg-red-900/30";
          } else {
            cls += "border-gray-200 dark:border-gray-600 opacity-50";
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} className={cls} disabled={showResult}>
              <span className="font-medium text-gray-700 dark:text-gray-200">{option}</span>
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-4">
          <p className={`text-sm font-medium ${selected === question.correctIndex ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            {selected === question.correctIndex ? "Correct !" : "Incorrect."}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{question.explanation}</p>
          <button onClick={handleNext} className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            {currentQ + 1 < questions.length ? "Question suivante" : "Voir le résultat"}
          </button>
        </div>
      )}
    </div>
  );
}
