"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll(".prose h2, .prose h3");
    const items: Heading[] = [];
    elements.forEach((el, i) => {
      const id = `heading-${i}`;
      el.setAttribute("id", id);
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) return null;

  return (
    <nav className="hidden xl:block fixed right-8 top-32 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        Sur cette page
      </p>
      <ul className="space-y-1.5 border-l-2 border-gray-200 dark:border-gray-700">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-xs py-0.5 transition-colors ${h.level === 3 ? "pl-5" : "pl-3"} ${
                activeId === h.id
                  ? "text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-400 -ml-[2px] font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
