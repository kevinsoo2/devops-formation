"use client";

import { useEffect, useState } from "react";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      const dismissed = localStorage.getItem("notif_dismissed");
      if (!dismissed) {
        setTimeout(() => setShow(true), 10000);
      }
    }
  }, []);

  const enable = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("DevOps Formation 🚀", { body: "Notifications activées ! On vous rappellera de continuer votre formation." });
    }
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem("notif_dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔔</span>
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-900 dark:text-white">Activer les notifications ?</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recevez un rappel pour maintenir votre streak !</p>
          <div className="flex gap-2 mt-3">
            <button onClick={enable} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Activer</button>
            <button onClick={dismiss} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">Plus tard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
