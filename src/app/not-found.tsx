import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Oups ! Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">Voici quelques suggestions :</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/cours" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
              Voir les cours
            </Link>
            <Link href="/cours/ansible/introduction" className="px-5 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium">
              Commencer Ansible
            </Link>
            <Link href="/cours/kubernetes/introduction" className="px-5 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium">
              Commencer Kubernetes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
