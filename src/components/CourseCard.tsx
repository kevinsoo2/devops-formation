import Link from "next/link";
import { Course } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/cours/${course.slug}`}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div className={`h-3 bg-gradient-to-r ${course.color}`} />
        <div className="p-6">
          <div className="text-4xl mb-4">{course.icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{course.lessons.length} leçons</span>
            <span className="text-blue-600 font-medium text-sm hover:text-blue-800">Commencer →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
