import { notFound } from "next/navigation";
import { courses, getCourse, getLesson, getLevelLabel, getLevelColor } from "@/lib/courses";
import { getLessonContent } from "@/content/lessons";
import { getQuiz } from "@/lib/quizzes";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Quiz from "@/components/Quiz";
import ProgressTracker from "@/components/ProgressTracker";

export function generateStaticParams() {
  const params: { courseSlug: string; lessonSlug: string }[] = [];
  courses.forEach((course) => {
    course.lessons.forEach((lesson) => {
      params.push({ courseSlug: course.slug, lessonSlug: lesson.slug });
    });
  });
  return params;
}

export default async function LessonPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const { courseSlug, lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const lesson = getLesson(courseSlug, lessonSlug);
  if (!course || !lesson) notFound();

  const content = getLessonContent(courseSlug, lessonSlug);
  const quiz = getQuiz(courseSlug, lessonSlug);
  const currentIndex = course.lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        <a href="/cours" className="hover:text-blue-600">Cours</a>{" / "}
        <a href={`/cours/${course.slug}`} className="hover:text-blue-600">{course.title}</a>{" / "}
        <span className="text-gray-900 dark:text-white">{lesson.title}</span>
      </nav>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>{getLevelLabel(lesson.level)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">⏱️ {lesson.duration}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{lesson.description}</p>
        </div>
        <ProgressTracker courseSlug={courseSlug} lessonSlug={lessonSlug} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        {content ? (
          <MarkdownRenderer content={content.content} />
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contenu en cours de rédaction</h2>
            <p className="text-gray-600 dark:text-gray-300">Cette leçon sera bientôt disponible.</p>
          </div>
        )}
        {quiz && <Quiz questions={quiz.questions} courseSlug={courseSlug} lessonSlug={lessonSlug} />}
      </div>
      <div className="flex justify-between items-center">
        {prevLesson ? (
          <a href={`/cours/${course.slug}/${prevLesson.slug}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">← {prevLesson.title}</a>
        ) : <div />}
        {nextLesson ? (
          <a href={`/cours/${course.slug}/${nextLesson.slug}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">{nextLesson.title} →</a>
        ) : (
          <a href={`/cours/${course.slug}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">Retour au cours →</a>
        )}
      </div>
    </div>
  );
}
