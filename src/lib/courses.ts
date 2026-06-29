export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: "debutant" | "intermediaire" | "avance";
  duration: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "ansible",
    title: "Ansible",
    description: "Automatisez vos infrastructures avec Ansible. Des playbooks simples aux rôles avancés.",
    icon: "🔧",
    color: "from-red-500 to-red-700",
    slug: "ansible",
    lessons: [
      { id: "ansible-intro", title: "Introduction à Ansible", description: "Découvrez Ansible, son architecture et ses concepts fondamentaux.", level: "debutant", duration: "30 min", slug: "introduction" },
      { id: "ansible-installation", title: "Installation et Configuration", description: "Installez Ansible et configurez votre premier inventaire.", level: "debutant", duration: "25 min", slug: "installation" },
      { id: "ansible-playbooks", title: "Écrire des Playbooks", description: "Créez vos premiers playbooks YAML pour automatiser des tâches.", level: "debutant", duration: "45 min", slug: "playbooks" },
      { id: "ansible-modules", title: "Les Modules Essentiels", description: "Maîtrisez les modules les plus utilisés : apt, yum, copy, template, service.", level: "intermediaire", duration: "40 min", slug: "modules" },
      { id: "ansible-roles", title: "Les Rôles Ansible", description: "Structurez votre code avec les rôles pour une meilleure réutilisabilité.", level: "intermediaire", duration: "50 min", slug: "roles" },
      { id: "ansible-vault", title: "Ansible Vault & Sécurité", description: "Protégez vos secrets et données sensibles avec Ansible Vault.", level: "avance", duration: "35 min", slug: "vault" },
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    description: "Orchestrez vos conteneurs avec Kubernetes. Du pod simple au cluster de production.",
    icon: "☸️",
    color: "from-blue-500 to-blue-700",
    slug: "kubernetes",
    lessons: [
      { id: "k8s-intro", title: "Introduction à Kubernetes", description: "Comprenez l'architecture de Kubernetes et ses composants.", level: "debutant", duration: "35 min", slug: "introduction" },
      { id: "k8s-pods", title: "Pods et Conteneurs", description: "Créez et gérez vos premiers Pods.", level: "debutant", duration: "30 min", slug: "pods" },
      { id: "k8s-deployments", title: "Deployments et Services", description: "Déployez des applications et exposez-les avec les Services.", level: "debutant", duration: "45 min", slug: "deployments" },
      { id: "k8s-networking", title: "Networking dans Kubernetes", description: "Ingress, Network Policies et communication entre services.", level: "intermediaire", duration: "50 min", slug: "networking" },
      { id: "k8s-storage", title: "Stockage Persistant", description: "PersistentVolumes, PersistentVolumeClaims et StorageClasses.", level: "intermediaire", duration: "40 min", slug: "storage" },
      { id: "k8s-helm", title: "Helm & Packaging", description: "Packagez et déployez vos applications avec Helm charts.", level: "avance", duration: "55 min", slug: "helm" },
    ],
  },
  {
    id: "redhat",
    title: "Red Hat / RHEL",
    description: "Maîtrisez l'administration système Red Hat Enterprise Linux du RHCSA au RHCE.",
    icon: "🎩",
    color: "from-red-700 to-red-900",
    slug: "redhat",
    lessons: [
      { id: "rhel-intro", title: "Introduction à RHEL", description: "Découvrez Red Hat Enterprise Linux et son écosystème.", level: "debutant", duration: "25 min", slug: "introduction" },
      { id: "rhel-filesystem", title: "Système de Fichiers & Permissions", description: "Maîtrisez le filesystem Linux, les permissions et ACLs.", level: "debutant", duration: "40 min", slug: "filesystem" },
      { id: "rhel-services", title: "Gestion des Services (systemd)", description: "Gérez les services avec systemd, créez vos propres units.", level: "debutant", duration: "35 min", slug: "services" },
      { id: "rhel-networking", title: "Configuration Réseau", description: "Configurez le réseau avec NetworkManager et firewalld.", level: "intermediaire", duration: "45 min", slug: "networking" },
      { id: "rhel-storage", title: "Stockage Avancé (LVM, Stratis)", description: "LVM, Stratis, VDO et gestion avancée du stockage.", level: "intermediaire", duration: "50 min", slug: "storage" },
      { id: "rhel-security", title: "SELinux & Sécurité", description: "Maîtrisez SELinux, les contexts et les politiques de sécurité.", level: "avance", duration: "60 min", slug: "security" },
    ],
  },
  {
    id: "docker",
    title: "Docker",
    description: "Maîtrisez la conteneurisation avec Docker. Du Dockerfile au déploiement en production.",
    icon: "🐳",
    color: "from-sky-500 to-sky-700",
    slug: "docker",
    lessons: [
      { id: "docker-intro", title: "Introduction à Docker", description: "Découvrez la conteneurisation, l'architecture Docker et ses concepts.", level: "debutant", duration: "35 min", slug: "introduction" },
      { id: "docker-installation", title: "Installation de Docker", description: "Installez Docker, découvrez Podman et les premières commandes.", level: "debutant", duration: "30 min", slug: "installation" },
      { id: "docker-images", title: "Images & Dockerfile", description: "Écrivez des Dockerfiles, builds multi-étapes et optimisation.", level: "debutant", duration: "50 min", slug: "images" },
      { id: "docker-compose", title: "Docker Compose", description: "Gérez des applications multi-conteneurs avec Compose.", level: "intermediaire", duration: "45 min", slug: "compose" },
      { id: "docker-networking", title: "Réseau & Volumes", description: "Réseaux Docker, volumes et persistance des données.", level: "intermediaire", duration: "40 min", slug: "networking" },
      { id: "docker-security", title: "Sécurité & Production", description: "Sécurisez vos conteneurs, CI/CD et registries.", level: "avance", duration: "55 min", slug: "security" },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string): Lesson | undefined {
  const course = getCourse(courseSlug);
  return course?.lessons.find((l) => l.slug === lessonSlug);
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case "debutant": return "Débutant";
    case "intermediaire": return "Intermédiaire";
    case "avance": return "Avancé";
    default: return level;
  }
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "debutant": return "bg-green-100 text-green-800";
    case "intermediaire": return "bg-yellow-100 text-yellow-800";
    case "avance": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}
