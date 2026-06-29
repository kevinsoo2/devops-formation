"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavProps {
  prevUrl?: string | null;
  nextUrl?: string | null;
}

export default function KeyboardNav({ prevUrl, nextUrl }: KeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && prevUrl) router.push(prevUrl);
      if (e.key === "ArrowRight" && nextUrl) router.push(nextUrl);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prevUrl, nextUrl, router]);

  return null;
}
