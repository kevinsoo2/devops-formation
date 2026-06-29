import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/courses";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Maîtrisez le <span className="text-blue-400">DevOps</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Des cours structurés pour apprendre Ansible, Kubernetes et Red Hat. Du débutant au niveau avancé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/cours" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">Commencer les cours</a>
            <a href="/a-propos" className="border border-gray-400 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">En savoir plus</a>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pourquoi cette formation ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-bold text-lg mb-2">Structuré par niveaux</h3>
              <p className="text-gray-600">Progressez à votre rythme du débutant au niveau avancé.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-bold text-lg mb-2">Exemples pratiques</h3>
              <p className="text-gray-600">Chaque leçon contient des exemples de code réels et des exercices.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-bold text-lg mb-2">Contenu évolutif</h3>
              <p className="text-gray-600">De nouvelles notions sont ajoutées régulièrement.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Nos parcours de formation</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Trois piliers essentiels du DevOps moderne.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (<CourseCard key={course.id} course={course} />))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-blue-100 mb-8">Choisissez un cours et lancez-vous dans l&apos;apprentissage du DevOps.</p>
          <a href="/cours" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg inline-block">Voir tous les cours</a>
        </div>
      </section>
    </div>
  );
}
