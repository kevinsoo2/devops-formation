import Link from "next/link";
import { Lesson, getLevelLabel, getLevelColor } from "@/lib/courses";

interface LessonCardProps {
  lesson: Lesson;
  courseSlug: string;
  index: number;
}

export default function LessonCard({ lesson, courseSlug, index }: LessonCardProps) {
  return (
    <Link href={`/cours/${courseSlug}/${lesson.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 p-5 border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
                {getLevelLabel(lesson.level)}
              </span>
              <span className="text-xs text-gray-500">⏱️ {lesson.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
