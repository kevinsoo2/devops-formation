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
  // ============================================
  // ANSIBLE
  // ============================================
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
    courseSlug: "ansible",
    lessonSlug: "installation",
    questions: [
      { question: "Quelle est la méthode recommandée pour installer Ansible sur la plupart des systèmes ?", options: ["Compilation depuis les sources", "Installation via pip", "Téléchargement d'un binaire", "Installation via npm"], correctIndex: 1, explanation: "pip est la méthode recommandée pour installer Ansible car elle fournit toujours la dernière version." },
      { question: "Quel fichier contient l'inventaire par défaut d'Ansible ?", options: ["/etc/ansible/hosts", "/etc/ansible/inventory", "/var/ansible/hosts", "~/.ansible/hosts"], correctIndex: 0, explanation: "Le fichier /etc/ansible/hosts est l'inventaire par défaut utilisé par Ansible." },
      { question: "Quelle commande permet de vérifier qu'Ansible est correctement installé ?", options: ["ansible --check", "ansible --version", "ansible --status", "ansible --test"], correctIndex: 1, explanation: "La commande 'ansible --version' affiche la version installée et confirme que l'installation fonctionne." },
    ],
  },
  {
    courseSlug: "ansible",
    lessonSlug: "playbooks",
    questions: [
      { question: "Par quel mot-clé commence la définition d'un play dans un playbook ?", options: ["tasks", "hosts", "name", "roles"], correctIndex: 1, explanation: "Chaque play doit définir 'hosts' pour spécifier sur quelles machines il s'exécute." },
      { question: "Quel mot-clé permet de définir des variables dans un playbook ?", options: ["variables", "vars", "define", "set"], correctIndex: 1, explanation: "Le mot-clé 'vars' permet de définir des variables au niveau d'un play." },
      { question: "Comment exécuter un playbook en mode simulation (dry-run) ?", options: ["ansible-playbook --dry-run", "ansible-playbook --check", "ansible-playbook --simulate", "ansible-playbook --test"], correctIndex: 1, explanation: "L'option --check exécute le playbook en mode simulation sans appliquer les changements." },
    ],
  },
  {
    courseSlug: "ansible",
    lessonSlug: "modules",
    questions: [
      { question: "Quel module Ansible est utilisé pour copier des fichiers vers les machines distantes ?", options: ["file", "copy", "transfer", "send"], correctIndex: 1, explanation: "Le module 'copy' permet de copier des fichiers depuis la machine de contrôle vers les machines gérées." },
      { question: "Quel module permet de gérer les paquets sur les systèmes basés sur Debian ?", options: ["yum", "dnf", "apt", "pkg"], correctIndex: 2, explanation: "Le module 'apt' gère les paquets sur les distributions Debian et Ubuntu." },
      { question: "Quel module permet d'exécuter des commandes shell arbitraires ?", options: ["command", "exec", "run", "bash"], correctIndex: 0, explanation: "Le module 'command' exécute des commandes sur les machines distantes, mais sans passer par un shell. Pour un shell complet, on utilise le module 'shell'." },
    ],
  },
  {
    courseSlug: "ansible",
    lessonSlug: "roles",
    questions: [
      { question: "Quel est l'avantage principal des rôles Ansible ?", options: ["Ils accélèrent l'exécution", "Ils permettent de réutiliser et organiser le code", "Ils ajoutent du chiffrement", "Ils remplacent les playbooks"], correctIndex: 1, explanation: "Les rôles permettent d'organiser le code en composants réutilisables avec une structure standardisée." },
      { question: "Quel répertoire dans un rôle contient les tâches principales ?", options: ["main/", "tasks/", "actions/", "plays/"], correctIndex: 1, explanation: "Le répertoire 'tasks/' contient les fichiers de tâches du rôle, avec un fichier main.yml comme point d'entrée." },
      { question: "Quelle commande permet de créer la structure d'un nouveau rôle ?", options: ["ansible-role init", "ansible-galaxy init", "ansible create role", "ansible-playbook --new-role"], correctIndex: 1, explanation: "La commande 'ansible-galaxy init' génère automatiquement la structure de répertoires d'un nouveau rôle." },
    ],
  },
  {
    courseSlug: "ansible",
    lessonSlug: "vault",
    questions: [
      { question: "À quoi sert Ansible Vault ?", options: ["Stocker des playbooks en ligne", "Chiffrer des données sensibles", "Gérer les versions des rôles", "Sauvegarder la configuration"], correctIndex: 1, explanation: "Ansible Vault permet de chiffrer des fichiers ou des variables contenant des données sensibles comme des mots de passe." },
      { question: "Quel algorithme de chiffrement est utilisé par Ansible Vault ?", options: ["RSA-2048", "AES-256", "Blowfish", "DES-3"], correctIndex: 1, explanation: "Ansible Vault utilise le chiffrement AES-256 pour protéger les données." },
      { question: "Quelle commande permet de modifier un fichier chiffré avec Vault ?", options: ["ansible-vault modify", "ansible-vault edit", "ansible-vault open", "ansible-vault decrypt --edit"], correctIndex: 1, explanation: "La commande 'ansible-vault edit' déchiffre temporairement le fichier, l'ouvre dans un éditeur, puis le re-chiffre après modification." },
    ],
  },
  // ============================================
  // KUBERNETES
  // ============================================
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
    courseSlug: "kubernetes",
    lessonSlug: "pods",
    questions: [
      { question: "Combien de conteneurs un Pod peut-il contenir au maximum ?", options: ["Un seul", "Deux", "Trois", "Plusieurs (pas de limite stricte)"], correctIndex: 3, explanation: "Un Pod peut contenir plusieurs conteneurs qui partagent le même espace réseau et de stockage." },
      { question: "Quel est l'état d'un Pod qui a été planifié mais dont les conteneurs ne sont pas encore prêts ?", options: ["Running", "Pending", "Waiting", "Initializing"], correctIndex: 1, explanation: "L'état 'Pending' signifie que le Pod a été accepté mais que ses conteneurs ne sont pas encore tous prêts." },
      { question: "Comment les conteneurs d'un même Pod communiquent-ils entre eux ?", options: ["Via un Service", "Via localhost", "Via un Ingress", "Via une API externe"], correctIndex: 1, explanation: "Les conteneurs d'un même Pod partagent le même espace réseau et peuvent communiquer via localhost." },
    ],
  },
  {
    courseSlug: "kubernetes",
    lessonSlug: "deployments",
    questions: [
      { question: "Quel est le rôle principal d'un Deployment ?", options: ["Exposer un service réseau", "Gérer le cycle de vie des ReplicaSets et Pods", "Stocker des données persistantes", "Configurer le réseau du cluster"], correctIndex: 1, explanation: "Un Deployment gère les ReplicaSets qui eux-mêmes gèrent les Pods, permettant les mises à jour déclaratives." },
      { question: "Quelle stratégie de mise à jour crée de nouveaux Pods avant de supprimer les anciens ?", options: ["Recreate", "RollingUpdate", "BlueGreen", "Canary"], correctIndex: 1, explanation: "La stratégie RollingUpdate remplace progressivement les anciens Pods par les nouveaux, assurant zéro downtime." },
      { question: "Quelle commande permet de revenir à une version précédente d'un Deployment ?", options: ["kubectl undo deployment", "kubectl rollback deployment", "kubectl rollout undo", "kubectl restore deployment"], correctIndex: 2, explanation: "La commande 'kubectl rollout undo' permet de revenir à la révision précédente d'un Deployment." },
    ],
  },
  {
    courseSlug: "kubernetes",
    lessonSlug: "networking",
    questions: [
      { question: "Quel objet Kubernetes expose un ensemble de Pods en tant que service réseau ?", options: ["Ingress", "Service", "Endpoint", "NetworkPolicy"], correctIndex: 1, explanation: "Un Service fournit une adresse IP stable et un DNS pour accéder à un ensemble de Pods." },
      { question: "Quel type de Service expose un port sur chaque noeud du cluster ?", options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"], correctIndex: 1, explanation: "Le type NodePort expose le service sur un port statique sur chaque noeud du cluster." },
      { question: "Quel objet gère l'accès HTTP/HTTPS externe vers les services du cluster ?", options: ["Service LoadBalancer", "Ingress", "Gateway", "Route"], correctIndex: 1, explanation: "L'Ingress gère le routage HTTP/HTTPS externe vers les services internes du cluster." },
    ],
  },
  {
    courseSlug: "kubernetes",
    lessonSlug: "storage",
    questions: [
      { question: "Quel objet représente une demande de stockage par un Pod ?", options: ["PersistentVolume", "PersistentVolumeClaim", "StorageClass", "VolumeMount"], correctIndex: 1, explanation: "Un PersistentVolumeClaim (PVC) est une demande de stockage qui sera liée à un PersistentVolume disponible." },
      { question: "Quel mode d'accès permet à plusieurs noeuds de monter un volume en lecture-écriture ?", options: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany", "ReadWriteOncePod"], correctIndex: 2, explanation: "ReadWriteMany (RWX) permet à plusieurs noeuds de monter le volume en lecture et écriture simultanément." },
      { question: "Que se passe-t-il par défaut quand un PVC est supprimé avec la politique 'Delete' ?", options: ["Le PV est conservé", "Le PV et les données sont supprimés", "Le PV est archivé", "Les données sont sauvegardées"], correctIndex: 1, explanation: "Avec la politique de réclamation 'Delete', le PersistentVolume et ses données sont supprimés quand le PVC est libéré." },
    ],
  },
  {
    courseSlug: "kubernetes",
    lessonSlug: "helm",
    questions: [
      { question: "Comment appelle-t-on un paquet Helm ?", options: ["Module", "Package", "Chart", "Bundle"], correctIndex: 2, explanation: "Un Chart est un paquet Helm qui contient les templates et valeurs nécessaires pour déployer une application." },
      { question: "Quel fichier contient les valeurs par défaut d'un Chart Helm ?", options: ["defaults.yaml", "values.yaml", "config.yaml", "params.yaml"], correctIndex: 1, explanation: "Le fichier values.yaml contient les valeurs par défaut qui peuvent être surchargées lors de l'installation." },
      { question: "Quelle commande installe un Chart Helm dans le cluster ?", options: ["helm deploy", "helm install", "helm apply", "helm create"], correctIndex: 1, explanation: "La commande 'helm install' déploie un Chart dans le cluster Kubernetes avec un nom de release." },
    ],
  },
  // ============================================
  // RED HAT
  // ============================================
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
    courseSlug: "redhat",
    lessonSlug: "filesystem",
    questions: [
      { question: "Quel répertoire contient les fichiers de configuration système sur RHEL ?", options: ["/var", "/etc", "/opt", "/usr"], correctIndex: 1, explanation: "Le répertoire /etc contient les fichiers de configuration du système et des applications." },
      { question: "Quelle commande permet de vérifier l'espace disque utilisé par les systèmes de fichiers ?", options: ["du -h", "df -h", "ls -la", "fdisk -l"], correctIndex: 1, explanation: "La commande 'df -h' affiche l'utilisation de l'espace disque de chaque système de fichiers monté, en format lisible." },
      { question: "Quel système de fichiers est le défaut sur RHEL 8 et supérieur ?", options: ["ext4", "btrfs", "xfs", "zfs"], correctIndex: 2, explanation: "XFS est le système de fichiers par défaut sur RHEL 8 et versions ultérieures, offrant de bonnes performances pour les gros volumes." },
    ],
  },
  {
    courseSlug: "redhat",
    lessonSlug: "services",
    questions: [
      { question: "Quelle commande démarre un service avec systemd ?", options: ["systemctl run httpd", "systemctl start httpd", "service httpd on", "systemd start httpd"], correctIndex: 1, explanation: "La commande 'systemctl start' permet de démarrer un service géré par systemd." },
      { question: "Comment activer un service au démarrage du système ?", options: ["systemctl activate httpd", "systemctl enable httpd", "systemctl boot httpd", "systemctl autostart httpd"], correctIndex: 1, explanation: "La commande 'systemctl enable' crée les liens symboliques nécessaires pour que le service démarre automatiquement." },
      { question: "Quel fichier définit la configuration d'une unité systemd personnalisée ?", options: ["/etc/init.d/service", "/etc/systemd/system/service.unit", "/etc/systemd/system/service.service", "/etc/services/service.conf"], correctIndex: 2, explanation: "Les unités systemd personnalisées sont définies dans /etc/systemd/system/ avec l'extension .service." },
    ],
  },
  {
    courseSlug: "redhat",
    lessonSlug: "networking",
    questions: [
      { question: "Quel outil en ligne de commande gère les connexions réseau sur RHEL ?", options: ["ifconfig", "nmcli", "netctl", "wpa_cli"], correctIndex: 1, explanation: "nmcli est l'outil en ligne de commande de NetworkManager pour gérer les connexions réseau sur RHEL." },
      { question: "Quel fichier contient la configuration DNS sur un système Linux ?", options: ["/etc/dns.conf", "/etc/resolv.conf", "/etc/network/dns", "/etc/named.conf"], correctIndex: 1, explanation: "Le fichier /etc/resolv.conf contient la configuration des serveurs DNS utilisés par le système." },
      { question: "Quelle commande affiche la table de routage sur RHEL ?", options: ["route show", "ip route", "netstat --routes", "nmcli route list"], correctIndex: 1, explanation: "La commande 'ip route' affiche la table de routage du système avec l'outil ip moderne." },
    ],
  },
  {
    courseSlug: "redhat",
    lessonSlug: "storage",
    questions: [
      { question: "Quel outil permet de gérer les volumes logiques (LVM) ?", options: ["fdisk", "lvm", "parted", "mkfs"], correctIndex: 1, explanation: "L'ensemble d'outils LVM (lvcreate, lvextend, etc.) permet de gérer les volumes logiques de manière flexible." },
      { question: "Quelle commande crée un nouveau volume logique ?", options: ["lvm create", "lvcreate", "vgcreate", "pvcreate"], correctIndex: 1, explanation: "La commande 'lvcreate' crée un nouveau volume logique dans un groupe de volumes existant." },
      { question: "Quel fichier configure les montages automatiques au démarrage ?", options: ["/etc/mounts", "/etc/fstab", "/etc/mtab", "/etc/automount"], correctIndex: 1, explanation: "Le fichier /etc/fstab définit les systèmes de fichiers à monter automatiquement au démarrage du système." },
    ],
  },
  {
    courseSlug: "redhat",
    lessonSlug: "security",
    questions: [
      { question: "Quel système de contrôle d'accès obligatoire est activé par défaut sur RHEL ?", options: ["AppArmor", "SELinux", "TOMOYO", "Smack"], correctIndex: 1, explanation: "SELinux (Security-Enhanced Linux) est le système MAC activé par défaut sur RHEL pour renforcer la sécurité." },
      { question: "Quelle commande affiche le contexte SELinux d'un fichier ?", options: ["ls -Z", "selinux --show", "getcontext", "semanage list"], correctIndex: 0, explanation: "La commande 'ls -Z' affiche les contextes SELinux des fichiers en plus des permissions classiques." },
      { question: "Quel outil gère le pare-feu sur RHEL ?", options: ["iptables", "ufw", "firewalld", "nftables"], correctIndex: 2, explanation: "firewalld est le service de pare-feu par défaut sur RHEL, géré via la commande firewall-cmd." },
    ],
  },
  // ============================================
  // DOCKER
  // ============================================
  {
    courseSlug: "docker",
    lessonSlug: "introduction",
    questions: [
      { question: "Quelle est la principale différence entre Docker et une VM ?", options: ["Docker est plus cher", "Docker partage le noyau de l'hôte", "Docker nécessite Windows", "Docker est plus lent"], correctIndex: 1, explanation: "Les conteneurs Docker partagent le noyau du système hôte, contrairement aux VMs qui ont leur propre OS." },
      { question: "Où sont stockées les images Docker par défaut ?", options: ["GitHub", "Docker Hub", "AWS S3", "Local uniquement"], correctIndex: 1, explanation: "Docker Hub est le registre public par défaut pour les images Docker." },
      { question: "Quel fichier décrit comment construire une image Docker ?", options: ["docker-compose.yml", "Dockerfile", "Makefile", "package.json"], correctIndex: 1, explanation: "Le Dockerfile contient les instructions pour construire une image Docker." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "installation",
    questions: [
      { question: "Quel démon doit être en cours d'exécution pour utiliser Docker ?", options: ["containerd", "dockerd", "cri-o", "runc"], correctIndex: 1, explanation: "Le démon Docker (dockerd) doit être en cours d'exécution pour gérer les conteneurs et les images." },
      { question: "Quel groupe système permet à un utilisateur d'exécuter Docker sans sudo ?", options: ["admin", "docker", "containers", "wheel"], correctIndex: 1, explanation: "Ajouter un utilisateur au groupe 'docker' lui permet d'exécuter les commandes Docker sans privilèges root." },
      { question: "Quelle commande vérifie que Docker est correctement installé ?", options: ["docker --check", "docker info", "docker status", "docker verify"], correctIndex: 1, explanation: "La commande 'docker info' affiche les informations détaillées sur l'installation Docker et confirme son bon fonctionnement." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "images",
    questions: [
      { question: "Quelle instruction Dockerfile définit l'image de base ?", options: ["BASE", "FROM", "IMAGE", "SOURCE"], correctIndex: 1, explanation: "L'instruction FROM spécifie l'image de base à partir de laquelle la nouvelle image est construite." },
      { question: "Quelle est la différence entre RUN et CMD dans un Dockerfile ?", options: ["RUN s'exécute au build, CMD au démarrage du conteneur", "RUN est pour Linux, CMD pour Windows", "Il n'y a pas de différence", "CMD s'exécute au build, RUN au démarrage"], correctIndex: 0, explanation: "RUN exécute des commandes pendant la construction de l'image, tandis que CMD définit la commande par défaut au démarrage du conteneur." },
      { question: "Comment réduire la taille d'une image Docker ?", options: ["Utiliser plus de layers", "Utiliser un build multi-stage", "Ajouter plus de fichiers", "Utiliser une image de base complète"], correctIndex: 1, explanation: "Le build multi-stage permet de séparer l'environnement de build de l'image finale, réduisant significativement la taille." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "compose",
    questions: [
      { question: "Quel fichier est utilisé par défaut par Docker Compose ?", options: ["docker-compose.yaml", "compose.yml", "docker-compose.yml", "Les deux B et C sont acceptés"], correctIndex: 3, explanation: "Docker Compose accepte docker-compose.yml et compose.yml comme noms de fichier par défaut." },
      { question: "Quelle commande lance tous les services définis dans un fichier Compose ?", options: ["docker-compose start", "docker-compose up", "docker-compose run", "docker-compose launch"], correctIndex: 1, explanation: "La commande 'docker-compose up' crée et démarre tous les conteneurs définis dans le fichier Compose." },
      { question: "Comment définir une dépendance entre services dans Docker Compose ?", options: ["links", "depends_on", "requires", "needs"], correctIndex: 1, explanation: "La directive 'depends_on' définit l'ordre de démarrage des services et leurs dépendances." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "networking",
    questions: [
      { question: "Quel est le réseau par défaut créé par Docker ?", options: ["host", "bridge", "overlay", "none"], correctIndex: 1, explanation: "Le réseau 'bridge' est le réseau par défaut pour les conteneurs Docker sur un hôte unique." },
      { question: "Quel type de réseau Docker permet la communication entre plusieurs hôtes ?", options: ["bridge", "host", "overlay", "macvlan"], correctIndex: 2, explanation: "Le réseau 'overlay' permet aux conteneurs sur différents hôtes Docker de communiquer entre eux." },
      { question: "Quelle option de la commande docker run publie un port ?", options: ["-e", "-p", "-v", "-n"], correctIndex: 1, explanation: "L'option '-p' (ou --publish) mappe un port du conteneur vers un port de l'hôte." },
    ],
  },
  {
    courseSlug: "docker",
    lessonSlug: "security",
    questions: [
      { question: "Pourquoi est-il déconseillé d'exécuter des processus en tant que root dans un conteneur ?", options: ["C'est plus lent", "Cela augmente la surface d'attaque en cas d'évasion", "Root n'existe pas dans les conteneurs", "Cela empêche le réseau de fonctionner"], correctIndex: 1, explanation: "Si un attaquant s'échappe du conteneur, les processus root auraient des privilèges élevés sur l'hôte." },
      { question: "Quelle instruction Dockerfile permet de changer l'utilisateur d'exécution ?", options: ["SWITCH", "USER", "RUNAS", "IDENTITY"], correctIndex: 1, explanation: "L'instruction USER définit l'utilisateur sous lequel les commandes suivantes et le conteneur s'exécuteront." },
      { question: "Quel outil permet de scanner les vulnérabilités dans les images Docker ?", options: ["docker audit", "docker scan / Trivy", "docker check", "docker verify"], correctIndex: 1, explanation: "Des outils comme Trivy ou 'docker scan' analysent les images pour détecter les vulnérabilités connues dans les paquets installés." },
    ],
  },
];

export function getQuiz(courseSlug: string, lessonSlug: string): Quiz | undefined {
  return quizzes.find((q) => q.courseSlug === courseSlug && q.lessonSlug === lessonSlug);
}
