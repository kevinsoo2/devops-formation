export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">À propos de DevOps Formation</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Notre mission</h2>
        <p className="text-gray-700 text-lg mb-6">
          Rendre l&apos;apprentissage du DevOps accessible à tous, avec des cours structurés, progressifs et basés sur la pratique.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Nos parcours</h2>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-lg">🎩 Red Hat / RHEL</h3>
            <p className="text-gray-600">Administration système Linux, préparation RHCSA/RHCE.</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-lg">🔧 Ansible</h3>
            <p className="text-gray-600">Automatisation d&apos;infrastructure, des playbooks simples aux rôles avancés.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-lg">☸️ Kubernetes</h3>
            <p className="text-gray-600">Orchestration de conteneurs, du premier Pod au cluster de production.</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Contenu évolutif</h2>
        <p className="text-gray-700 text-lg mb-4">Prochainement :</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Docker &amp; Conteneurisation avancée</li>
          <li>Terraform &amp; Infrastructure as Code</li>
          <li>CI/CD avec Jenkins et GitLab CI</li>
          <li>Monitoring avec Prometheus &amp; Grafana</li>
          <li>GitOps avec ArgoCD</li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Niveaux de progression</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">🟢</div><h3 className="font-semibold">Débutant</h3>
            <p className="text-sm text-gray-600">Concepts de base</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl mb-2">🟡</div><h3 className="font-semibold">Intermédiaire</h3>
            <p className="text-sm text-gray-600">Mise en pratique</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl mb-2">🔴</div><h3 className="font-semibold">Avancé</h3>
            <p className="text-sm text-gray-600">Production et sécurité</p>
          </div>
        </div>
      </div>
    </div>
  );
}
