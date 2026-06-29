import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/courses";
import LessonCard from "@/components/LessonCard";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CoursDetailPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <span className="text-5xl mb-4 block">{course.icon}</span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{course.description}</p>
        <div className="mt-4 text-sm text-gray-500">{course.lessons.length} leçons disponibles</div>
      </div>
      <div className="space-y-4">
        {course.lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} courseSlug={course.slug} index={index} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="/cours" className="text-blue-600 hover:text-blue-800 font-medium">← Retour aux cours</a>
      </div>
    </div>
  );
}
