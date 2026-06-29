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
  {
    id: "terraform",
    title: "Terraform",
    description: "Gérez votre infrastructure as code avec Terraform. Des premiers pas aux modules avancés.",
    icon: "🏗️",
    color: "from-purple-500 to-purple-700",
    slug: "terraform",
    lessons: [
      { id: "tf-intro", title: "Introduction à Terraform", description: "Découvrez l'Infrastructure as Code et les concepts de Terraform.", level: "debutant", duration: "30 min", slug: "introduction" },
      { id: "tf-install", title: "Installation et premiers pas", description: "Installez Terraform et créez votre première ressource.", level: "debutant", duration: "35 min", slug: "installation" },
      { id: "tf-resources", title: "Ressources et Data Sources", description: "Gérez des ressources cloud et exploitez les data sources.", level: "debutant", duration: "45 min", slug: "resources" },
      { id: "tf-variables", title: "Variables et Outputs", description: "Paramétrez vos configurations avec les variables et outputs.", level: "intermediaire", duration: "40 min", slug: "variables" },
      { id: "tf-modules", title: "Modules Terraform", description: "Structurez et réutilisez votre code avec les modules.", level: "intermediaire", duration: "50 min", slug: "modules" },
      { id: "tf-state", title: "State et Workspaces", description: "Gérez le state distant, les workspaces et l'import de ressources.", level: "avance", duration: "55 min", slug: "state" },
    ],
  },
  {
    id: "cicd",
    title: "CI/CD",
    description: "Automatisez vos pipelines avec GitHub Actions, GitLab CI et Jenkins.",
    icon: "🔄",
    color: "from-green-500 to-green-700",
    slug: "cicd",
    lessons: [
      { id: "cicd-intro", title: "Introduction au CI/CD", description: "Concepts CI/CD, avantages et vue d'ensemble des outils.", level: "debutant", duration: "30 min", slug: "introduction" },
      { id: "cicd-github", title: "GitHub Actions", description: "Workflows, triggers, jobs, marketplace et secrets.", level: "debutant", duration: "45 min", slug: "github-actions" },
      { id: "cicd-gitlab", title: "GitLab CI/CD", description: ".gitlab-ci.yml, stages, runners et artifacts.", level: "intermediaire", duration: "45 min", slug: "gitlab-ci" },
      { id: "cicd-jenkins", title: "Jenkins", description: "Installation, Jenkinsfile et pipeline as code.", level: "intermediaire", duration: "50 min", slug: "jenkins" },
      { id: "cicd-docker", title: "CI/CD avec Docker", description: "Build d'images, registries et cache dans les pipelines.", level: "intermediaire", duration: "40 min", slug: "docker" },
      { id: "cicd-practices", title: "Bonnes Pratiques", description: "Branching, versioning, déploiement blue-green et canary.", level: "avance", duration: "50 min", slug: "best-practices" },
    ],
  },
  {
    id: "prometheus",
    title: "Prometheus & Grafana",
    description: "Monitoring, alerting et dashboards pour vos applications et infrastructure.",
    icon: "📊",
    color: "from-orange-500 to-orange-700",
    slug: "prometheus",
    lessons: [
      { id: "prom-intro", title: "Introduction au Monitoring", description: "Pourquoi monitorer, architecture Prometheus et PromQL.", level: "debutant", duration: "35 min", slug: "introduction" },
      { id: "prom-install", title: "Installation", description: "Docker Compose, configuration et service discovery.", level: "debutant", duration: "40 min", slug: "installation" },
      { id: "prom-metrics", title: "Types de Métriques", description: "Counters, gauges, histograms et instrumentation.", level: "intermediaire", duration: "45 min", slug: "metrics" },
      { id: "prom-alerting", title: "Alerting", description: "Alertmanager, règles d'alerte et receivers.", level: "intermediaire", duration: "45 min", slug: "alerting" },
      { id: "grafana-intro", title: "Grafana", description: "Installation, data sources, dashboards et variables.", level: "intermediaire", duration: "40 min", slug: "grafana" },
      { id: "grafana-dash", title: "Dashboards Avancés", description: "Panels personnalisés, alertes et provisioning.", level: "avance", duration: "50 min", slug: "dashboards" },
    ],
  },
  {
    id: "gitops",
    title: "GitOps & ArgoCD",
    description: "Déploiement déclaratif via Git avec ArgoCD et les principes GitOps.",
    icon: "🔀",
    color: "from-indigo-500 to-indigo-700",
    slug: "gitops",
    lessons: [
      { id: "gitops-intro", title: "Introduction au GitOps", description: "Principes, push vs pull et comparaison des outils.", level: "debutant", duration: "30 min", slug: "introduction" },
      { id: "gitops-install", title: "Installation d'ArgoCD", description: "Déploiement K8s, CLI et interface web.", level: "debutant", duration: "35 min", slug: "argocd-install" },
      { id: "gitops-apps", title: "Applications ArgoCD", description: "Création d'apps, sync policies et health checks.", level: "intermediaire", duration: "45 min", slug: "argocd-apps" },
      { id: "gitops-repos", title: "Structure de Dépôt", description: "App-of-apps, overlays, Kustomize et Helm.", level: "intermediaire", duration: "45 min", slug: "repo-structure" },
      { id: "gitops-secrets", title: "Gestion des Secrets", description: "Sealed Secrets, External Secrets et Vault.", level: "avance", duration: "50 min", slug: "secrets" },
      { id: "gitops-advanced", title: "GitOps Avancé", description: "Multi-cluster, ApplicationSets et progressive delivery.", level: "avance", duration: "55 min", slug: "advanced" },
    ],
  },
  {
    id: "linux",
    title: "Linux Avancé",
    description: "Scripting bash, traitement de texte, performance et troubleshooting.",
    icon: "🐧",
    color: "from-gray-600 to-gray-800",
    slug: "linux",
    lessons: [
      { id: "linux-scripting", title: "Scripting Bash", description: "Variables, conditions, boucles et fonctions.", level: "debutant", duration: "45 min", slug: "scripting" },
      { id: "linux-text", title: "Traitement de Texte", description: "grep, sed, awk, pipes et xargs.", level: "intermediaire", duration: "40 min", slug: "text-processing" },
      { id: "linux-processes", title: "Gestion des Processus", description: "ps, top, kill, nice et jobs.", level: "intermediaire", duration: "35 min", slug: "processes" },
      { id: "linux-cron", title: "Planification de Tâches", description: "Cron, crontab, timers systemd et anacron.", level: "intermediaire", duration: "30 min", slug: "cron" },
      { id: "linux-perf", title: "Performance", description: "vmstat, iostat, strace et tuning kernel.", level: "avance", duration: "50 min", slug: "performance" },
      { id: "linux-debug", title: "Troubleshooting", description: "dmesg, journalctl, tcpdump et résolution de problèmes.", level: "avance", duration: "55 min", slug: "troubleshooting" },
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
