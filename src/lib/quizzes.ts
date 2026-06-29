export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  courseSlug: string;
  lessonSlug: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    courseSlug: "ansible",
    lessonSlug: "introduction",
    questions: [
      { question: "Quel protocole Ansible utilise-t-il pour se connecter aux machines ?", options: ["HTTP", "SSH", "FTP", "SNMP"], correctIndex: 1, explanation: "Ansible utilise SSH pour communiquer avec les machines gérées (agentless)." },
      { question: "Quel format utilise Ansible pour ses playbooks ?", options: ["JSON", "XML", "YAML", "TOML"], correctIndex: 2, explanation: "Les playbooks Ansible sont écrits en YAML." },
      { question: "Que signifie 'idempotent' ?", options: ["Rapide à exécuter", "Peut être relancé sans effets secondaires", "Fonctionne sans réseau", "Ne nécessite pas de mot de passe"], correctIndex: 1, explanation: "L'idempotence signifie qu'on peut relancer sans changer le résultat si l'état est déjà atteint." },
    ],
  },
  {
    courseSlug: "kubernetes",
    lessonSlug: "introduction",
    questions: [
      { question: "Quel composant stocke l'état du cluster Kubernetes ?", options: ["API Server", "etcd", "Scheduler", "kubelet"], correctIndex: 1, explanation: "etcd est la base de données clé-valeur qui stocke tout l'état du cluster." },
      { question: "Quelle est la plus petite unité déployable dans K8s ?", options: ["Container", "Pod", "Deployment", "Service"], correctIndex: 1, explanation: "Le Pod est la plus petite unité déployable, il contient un ou plusieurs conteneurs." },
      { question: "Quel composant décide sur quel noeud placer un Pod ?", options: ["Controller Manager", "kubelet", "Scheduler", "kube-proxy"], correctIndex: 2, explanation: "Le Scheduler assigne les Pods aux noeuds en fonction des ressources disponibles." },
    ],
  },
  {
    courseSlug: "redhat",
    lessonSlug: "introduction",
    questions: [
      { question: "Quel gestionnaire de paquets est utilisé sur RHEL ?", options: ["apt", "dnf", "pacman", "zypper"], correctIndex: 1, explanation: "dnf (Dandified Yum) est le gestionnaire de paquets par défaut sur RHEL." },
      { question: "Quelle certification Red Hat est le niveau fondamental ?", options: ["RHCE", "RHCA", "RHCSA", "RHCSS"], correctIndex: 2, explanation: "RHCSA (Red Hat Certified System Administrator) est la certification de base." },
      { question: "Quel outil gère les services sur RHEL ?", options: ["init.d", "systemd", "upstart", "launchd"], correctIndex: 1, explanation: "systemd est le système d'initialisation et de gestion des services sur RHEL." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "introduction",
    questions: [
      { question: "Quelle est la principale différence entre Docker et une VM ?", options: ["Docker est plus cher", "Docker partage le noyau de l'hôte", "Docker nécessite Windows", "Docker est plus lent"], correctIndex: 1, explanation: "Les conteneurs Docker partagent le noyau du système hôte, contrairement aux VMs qui ont leur propre OS." },
      { question: "Où sont stockées les images Docker par défaut ?", options: ["GitHub", "Docker Hub", "AWS S3", "Local uniquement"], correctIndex: 1, explanation: "Docker Hub est le registre public par défaut pour les images Docker." },
      { question: "Quel fichier décrit comment construire une image Docker ?", options: ["docker-compose.yml", "Dockerfile", "Makefile", "package.json"], correctIndex: 1, explanation: "Le Dockerfile contient les instructions pour construire une image Docker." },
    ],
  },
];

export function getQuiz(courseSlug: string, lessonSlug: string): Quiz | undefined {
  return quizzes.find((q) => q.courseSlug === courseSlug && q.lessonSlug === lessonSlug);
}
