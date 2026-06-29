import { notFound } from "next/navigation";
import { courses, getCourse, getLesson, getLevelLabel, getLevelColor } from "@/lib/courses";
import { getLessonContent } from "@/content/lessons";
import { getQuiz } from "@/lib/quizzes";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Quiz from "@/components/Quiz";
import ProgressTracker from "@/components/ProgressTracker";
import ScrollProgress from "@/components/ScrollProgress";
import TableOfContents from "@/components/TableOfContents";
import FavoriteButton from "@/components/FavoriteButton";
import Comments from "@/components/Comments";
import KeyboardNav from "@/components/KeyboardNav";
import TextToSpeech from "@/components/TextToSpeech";
import ShareButtons from "@/components/ShareButtons";

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
  const readingTime = content ? Math.max(1, Math.ceil(content.content.split(/\s+/).length / 200)) : 0;

  return (
    <>
      <ScrollProgress />
      <KeyboardNav
        prevUrl={prevLesson ? `/cours/${course.slug}/${prevLesson.slug}` : null}
        nextUrl={nextLesson ? `/cours/${course.slug}/${nextLesson.slug}` : null}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <TableOfContents />

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 flex-wrap gap-1">
          <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">🏠</a>
          <span>/</span>
          <a href="/cours" className="hover:text-blue-600 dark:hover:text-blue-400">Cours</a>
          <span>/</span>
          <a href={`/cours/${course.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">{course.icon} {course.title}</a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{lesson.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>{getLevelLabel(lesson.level)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">⏱️ {lesson.duration}</span>
                {readingTime > 0 && <span className="text-sm text-gray-500 dark:text-gray-400">📖 ~{readingTime} min lecture</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <TextToSpeech />
              <FavoriteButton courseSlug={courseSlug} lessonSlug={lessonSlug} lessonTitle={lesson.title} />
              <ProgressTracker courseSlug={courseSlug} lessonSlug={lessonSlug} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
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
        <Comments courseSlug={courseSlug} lessonSlug={lessonSlug} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          {prevLesson ? (
            <a href={`/cours/${course.slug}/${prevLesson.slug}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden sm:inline">{prevLesson.title}</span>
              <span className="sm:hidden">Précédent</span>
            </a>
          ) : <div />}
          <a href={`/cours/${course.slug}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
            {course.icon} Sommaire
          </a>
          {nextLesson ? (
            <a href={`/cours/${course.slug}/${nextLesson.slug}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
              <span className="hidden sm:inline">{nextLesson.title}</span>
              <span className="sm:hidden">Suivant</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          ) : (
            <a href={`/cours/${course.slug}`} className="flex items-center gap-2 text-green-600 hover:text-green-800 dark:text-green-400 font-medium text-sm">
              Cours terminé ✅
            </a>
          )}
        </div>
      </div>
    </>
  );
}
