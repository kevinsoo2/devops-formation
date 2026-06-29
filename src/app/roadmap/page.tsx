export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">🗺️ Roadmap</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12">Les prochaines fonctionnalités et mises à jour prévues.</p>

      {/* Completed */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">✅ Terminé</h2>
        <div className="space-y-3">
          {[
            "9 parcours de formation (54 leçons)",
            "Quiz interactifs (72 questions)",
            "Authentification GitHub + Google",
            "Base de données Turso (progression persistante)",
            "Gamification (XP, badges, streak, confetti)",
            "Page profil avec statistiques",
            "Mode sombre",
            "PWA (installable, hors-ligne)",
            "Éditeur de code Monaco intégré",
            "Terminal Linux (Killercoda)",
            "Commentaires et réactions",
            "Barre de recherche",
            "Heatmap d'activité",
            "Text-to-Speech",
            "Arbre de compétences",
            "Mode examen",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">🚧 En cours</h2>
        <div className="space-y-3">
          {[
            "Vidéos tutorielles intégrées (YouTube)",
            "Projet guidé complet (Déployer sur K8s de A à Z)",
            "Système de certification vérifiable",
            "Blog SEO avec articles complémentaires",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <span className="text-yellow-600">◐</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Planned */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">📋 Prévu</h2>
        <div className="space-y-3">
          {[
            "Chatbot IA (assistant personnel)",
            "App mobile (iOS / Android)",
            "Nom de domaine personnalisé",
            "Multi-langue (anglais, espagnol)",
            "Communauté Discord intégrée",
            "Newsletter hebdomadaire",
            "Système de mentorat",
            "Marketplace de projets",
            "Intégration Kubernetes (hébergement propre)",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-blue-600">○</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
