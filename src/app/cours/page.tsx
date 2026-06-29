import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/courses";

export default function CoursPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tous nos cours</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choisissez votre parcours et progressez du niveau débutant au niveau avancé.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {courses.map((course) => (<CourseCard key={course.id} course={course} />))}
      </div>
      <section className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🗺️ Parcours recommandé</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <span className="text-2xl">1️⃣</span>
            <div><h3 className="font-semibold">Red Hat / RHEL - Les bases Linux</h3><p className="text-sm text-gray-600">Commencez par maîtriser l&apos;administration système Linux</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-2xl">2️⃣</span>
            <div><h3 className="font-semibold">Ansible - Automatisation</h3><p className="text-sm text-gray-600">Automatisez la gestion de vos serveurs</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-2xl">3️⃣</span>
            <div><h3 className="font-semibold">Kubernetes - Orchestration</h3><p className="text-sm text-gray-600">Orchestrez vos applications conteneurisées</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
