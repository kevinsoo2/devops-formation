"use client";

import { useState, useEffect } from "react";

export default function TextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  const speak = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const prose = document.querySelector(".prose");
    if (!prose) return;

    const text = prose.textContent || "";
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 5000));
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (!supported) return null;

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        speaking
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      }`}
      title={speaking ? "Arrêter la lecture" : "Écouter la leçon"}
    >
      {speaking ? (
        <>⏹ Arrêter</>
      ) : (
        <>🔊 Écouter</>
      )}
    </button>
  );
}
