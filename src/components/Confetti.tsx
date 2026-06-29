"use client";

import { useEffect } from "react";

export default function Confetti({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (!trigger) return;
    import("canvas-confetti").then((confetti) => {
      const fire = confetti.default;
      fire({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => fire({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 200);
      setTimeout(() => fire({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
    });
  }, [trigger]);

  return null;
}
