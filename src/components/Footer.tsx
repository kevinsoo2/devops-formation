export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">🚀 DevOps Formation</h3>
            <p className="text-sm">Apprenez les bases du DevOps avec des cours structurés sur Ansible, Kubernetes et Red Hat.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Cours</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/cours/ansible" className="hover:text-white transition-colors">Ansible</a></li>
              <li><a href="/cours/kubernetes" className="hover:text-white transition-colors">Kubernetes</a></li>
              <li><a href="/cours/redhat" className="hover:text-white transition-colors">Red Hat / RHEL</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Niveaux</h3>
            <ul className="space-y-2 text-sm">
              <li>🟢 Débutant</li>
              <li>🟡 Intermédiaire</li>
              <li>🔴 Avancé</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DevOps Formation. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
