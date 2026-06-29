"use client";

import { useState, useEffect } from "react";
import { QuizQuestion } from "@/lib/quizzes";
import Confetti from "./Confetti";

interface ExamModeProps {
  questions: QuizQuestion[];
  courseTitle: string;
  courseSlug: string;
}

export default function ExamMode({ questions, courseTitle, courseSlug }: ExamModeProps) {
  const [isExam, setIsExam] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min par question
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isExam || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); finishExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExam, finished]);

  const finishExam = () => {
    let s = 0;
    answers.forEach((a, i) => { if (a === questions[i].correctIndex) s++; });
    setScore(s);
    setFinished(true);
    const pct = Math.round((s / questions.length) * 100);
    if (pct >= 70) {
      const currentXP = parseInt(localStorage.getItem("userXP") || "0");
      localStorage.setItem("userXP", String(currentXP + 200));
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!isExam) {
    return (
      <button onClick={() => setIsExam(true)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
        🎓 Mode Examen ({questions.length} questions, {questions.length} min)
      </button>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div className="mt-6 p-6 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
        <Confetti trigger={passed} />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎓 Résultat de l&apos;examen</h3>
        <p className="text-lg mb-4">{courseTitle}</p>
        <div className={`text-5xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>{pct}%</div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{score}/{questions.length} bonnes réponses</p>
        {passed ? (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium">🏆 Félicitations ! Vous avez réussi l&apos;examen ! (+200 XP)</p>
          </div>
        ) : (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <p className="text-red-800 dark:text-red-300 font-medium">❌ Score insuffisant (minimum 70%). Révisez et réessayez !</p>
          </div>
        )}
        <button onClick={() => { setIsExam(false); setFinished(false); setCurrentQ(0); setAnswers(new Array(questions.length).fill(null)); setTimeLeft(questions.length * 60); }} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">🎓 Mode Examen</h3>
        <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-600" : "text-gray-600 dark:text-gray-300"}`}>⏱ {formatTime(timeLeft)}</span>
      </div>
      <div className="flex gap-1 mb-4 flex-wrap">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)} className={`w-7 h-7 rounded text-xs font-medium ${i === currentQ ? "bg-purple-600 text-white" : answers[i] !== null ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>{i + 1}</button>
        ))}
      </div>
      <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">{questions[currentQ].question}</p>
      <div className="space-y-2">
        {questions[currentQ].options.map((opt, i) => (
          <button key={i} onClick={() => { const newAnswers = [...answers]; newAnswers[currentQ] = i; setAnswers(newAnswers); }} className={`w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ${answers[currentQ] === i ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-600 hover:border-purple-300"}`}>
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">← Précédent</button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)} className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">Suivant →</button>
        ) : (
          <button onClick={finishExam} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-medium">Terminer l&apos;examen</button>
        )}
      </div>
    </div>
  );
}
