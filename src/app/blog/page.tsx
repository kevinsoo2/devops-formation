import Link from "next/link";

const articles = [
  { slug: "debuter-devops-2024", title: "Comment débuter en DevOps en 2024", date: "29 juin 2026", category: "Guide", readTime: "5 min", excerpt: "Le DevOps est un domaine vaste. Voici un guide structuré pour savoir par où commencer et dans quel ordre apprendre les technologies essentielles." },
  { slug: "ansible-vs-terraform", title: "Ansible vs Terraform : lequel choisir ?", date: "28 juin 2026", category: "Comparatif", readTime: "4 min", excerpt: "Ces deux outils sont souvent confondus. Ansible gère la configuration, Terraform gère l'infrastructure. Voici quand utiliser l'un ou l'autre." },
  { slug: "kubernetes-production", title: "Kubernetes en production : les erreurs à éviter", date: "27 juin 2026", category: "Best practices", readTime: "6 min", excerpt: "Déployer sur K8s c'est facile, le maintenir en production c'est autre chose. Voici les 10 erreurs les plus courantes." },
  { slug: "docker-securite", title: "Sécuriser ses conteneurs Docker", date: "26 juin 2026", category: "Sécurité", readTime: "5 min", excerpt: "Images minimales, utilisateur non-root, scan de vulnérabilités... Les bonnes pratiques pour des conteneurs sécurisés." },
  { slug: "cicd-github-actions", title: "Pipeline CI/CD parfait avec GitHub Actions", date: "25 juin 2026", category: "Tutorial", readTime: "7 min", excerpt: "Créez un pipeline complet : lint, test, build Docker, scan de sécurité et déploiement automatique." },
  { slug: "monitoring-prometheus", title: "Monitoring : par où commencer ?", date: "24 juin 2026", category: "Guide", readTime: "4 min", excerpt: "Les 4 signaux d'or, Prometheus, Grafana... Comment mettre en place un monitoring efficace sans se noyer." },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">📰 Blog DevOps</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Articles, tutoriels et bonnes pratiques pour progresser en DevOps.</p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">{article.category}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{article.date}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">· {article.readTime} de lecture</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Link href={`/cours`}>{article.title}</Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{article.excerpt}</p>
            <Link href="/cours" className="inline-block mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Lire la suite →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
