import { ansibleInstallation, ansiblePlaybooks, ansibleModules, ansibleRoles, ansibleVault } from "./ansible-lessons";
import { k8sPods, k8sDeployments, k8sNetworking, k8sStorage, k8sHelm } from "./kubernetes-lessons";
import { rhelFilesystem, rhelServices, rhelNetworking, rhelStorage, rhelSecurity } from "./redhat-lessons";
import { dockerIntro, dockerInstallation, dockerImages, dockerCompose, dockerNetworking, dockerSecurity } from "./docker-lessons";
import { terraformIntro, terraformInstallation, terraformResources, terraformVariables, terraformModules, terraformState } from "./terraform-lessons";

export interface LessonContent {
  courseSlug: string;
  lessonSlug: string;
  content: string;
}

const ansibleIntro = `# Introduction à Ansible

## Qu'est-ce qu'Ansible ?

Ansible est un outil d'automatisation open-source développé par Red Hat. Il permet de :
- **Configurer** des serveurs automatiquement
- **Déployer** des applications
- **Orchestrer** des workflows complexes
- **Gérer** l'infrastructure as code

## Architecture d'Ansible

\`\`\`
┌─────────────────┐
│  Control Node   │  ← Votre machine
└───────┬─────────┘
        │ SSH
        ├────────────┐────────────┐
        ▼            ▼            ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Node 1    │ │  Node 2    │ │  Node 3    │
└────────────┘ └────────────┘ └────────────┘
\`\`\`

## Concepts fondamentaux

### 1. Inventaire
\`\`\`ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com
\`\`\`

### 2. Modules
- \`apt\` / \`yum\` : installer des paquets
- \`copy\` : copier des fichiers
- \`service\` : gérer des services
- \`template\` : templates Jinja2

### 3. Playbooks
\`\`\`yaml
---
- name: Configurer un serveur web
  hosts: webservers
  become: yes
  tasks:
    - name: Installer nginx
      apt:
        name: nginx
        state: present
    - name: Démarrer nginx
      service:
        name: nginx
        state: started
        enabled: yes
\`\`\`

## Avantages d'Ansible

| Avantage | Description |
|----------|-------------|
| **Agentless** | Pas d'agent sur les machines cibles |
| **SSH** | Utilise SSH natif |
| **YAML** | Syntaxe simple et lisible |
| **Idempotent** | Peut être relancé sans risque |

## Exercice pratique

> **Exercice** : Testez la connexion SSH à une machine.

\`\`\`bash
ssh user@serveur "echo 'Connexion réussie !'"
\`\`\`
`;

const k8sIntro = `# Introduction à Kubernetes

## Qu'est-ce que Kubernetes ?

Kubernetes (K8s) est une plateforme d'orchestration de conteneurs développée par Google.

- **Déployer** des applications conteneurisées
- **Scaler** automatiquement selon la charge
- **Guérir** automatiquement les applications en panne

## Composants du Control Plane

| Composant | Rôle |
|-----------|------|
| **API Server** | Point d'entrée des requêtes |
| **etcd** | Base de données clé-valeur |
| **Scheduler** | Place les Pods sur les noeuds |
| **Controller Manager** | Maintient l'état souhaité |

## Composants des Noeuds

| Composant | Rôle |
|-----------|------|
| **kubelet** | Gère les Pods sur le noeud |
| **kube-proxy** | Réseau et load balancing |
| **Container Runtime** | Exécute les conteneurs |

## Objets essentiels

### Pod
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-app
spec:
  containers:
    - name: app
      image: nginx:latest
      ports:
        - containerPort: 80
\`\`\`

### Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
        - name: app
          image: nginx:latest
\`\`\`

## Commandes kubectl essentielles

\`\`\`bash
kubectl get pods
kubectl get deployments
kubectl apply -f deployment.yaml
kubectl logs mon-pod
kubectl exec -it mon-pod -- /bin/bash
kubectl scale deployment mon-app --replicas=5
\`\`\`

## Exercice pratique

> **Exercice** : Utilisez [Killercoda](https://killercoda.com) pour déployer votre premier Pod.
`;

const rhelIntro = `# Introduction à Red Hat Enterprise Linux

## Qu'est-ce que RHEL ?

Red Hat Enterprise Linux est la distribution Linux de référence en entreprise.

- **Stabilité** : support de 10 ans
- **Sécurité** : certifications FIPS
- **Support** : support professionnel Red Hat

## Certifications Red Hat

| Certification | Niveau | Description |
|---------------|--------|-------------|
| **RHCSA** | Fondamental | Administration système |
| **RHCE** | Avancé | Automatisation Ansible |
| **RHCA** | Expert | Spécialisations |

## Commandes de base

### Gestion des paquets
\`\`\`bash
dnf search httpd
sudo dnf install httpd -y
sudo dnf update -y
\`\`\`

### Gestion des utilisateurs
\`\`\`bash
sudo useradd -m -s /bin/bash devops
sudo passwd devops
sudo usermod -aG wheel devops
\`\`\`

### Gestion des services
\`\`\`bash
sudo systemctl start httpd
sudo systemctl enable httpd
systemctl status httpd
\`\`\`

## Arborescence Linux

\`\`\`
/
├── /etc/    → Configuration
├── /var/    → Données variables
├── /home/   → Utilisateurs
├── /opt/    → Logiciels tiers
├── /tmp/    → Fichiers temporaires
└── /usr/    → Programmes
\`\`\`

## Exercice pratique

> **Exercice** : Créez un utilisateur et installez vim.

\`\`\`bash
sudo useradd -m formation
sudo dnf install vim -y
\`\`\`
`;

export const lessonsContent: LessonContent[] = [
  // Ansible
  { courseSlug: "ansible", lessonSlug: "introduction", content: ansibleIntro },
  { courseSlug: "ansible", lessonSlug: "installation", content: ansibleInstallation },
  { courseSlug: "ansible", lessonSlug: "playbooks", content: ansiblePlaybooks },
  { courseSlug: "ansible", lessonSlug: "modules", content: ansibleModules },
  { courseSlug: "ansible", lessonSlug: "roles", content: ansibleRoles },
  { courseSlug: "ansible", lessonSlug: "vault", content: ansibleVault },
  // Kubernetes
  { courseSlug: "kubernetes", lessonSlug: "introduction", content: k8sIntro },
  { courseSlug: "kubernetes", lessonSlug: "pods", content: k8sPods },
  { courseSlug: "kubernetes", lessonSlug: "deployments", content: k8sDeployments },
  { courseSlug: "kubernetes", lessonSlug: "networking", content: k8sNetworking },
  { courseSlug: "kubernetes", lessonSlug: "storage", content: k8sStorage },
  { courseSlug: "kubernetes", lessonSlug: "helm", content: k8sHelm },
  // Red Hat
  { courseSlug: "redhat", lessonSlug: "introduction", content: rhelIntro },
  { courseSlug: "redhat", lessonSlug: "filesystem", content: rhelFilesystem },
  { courseSlug: "redhat", lessonSlug: "services", content: rhelServices },
  { courseSlug: "redhat", lessonSlug: "networking", content: rhelNetworking },
  { courseSlug: "redhat", lessonSlug: "storage", content: rhelStorage },
  { courseSlug: "redhat", lessonSlug: "security", content: rhelSecurity },
  // Docker
  { courseSlug: "docker", lessonSlug: "introduction", content: dockerIntro },
  { courseSlug: "docker", lessonSlug: "installation", content: dockerInstallation },
  { courseSlug: "docker", lessonSlug: "images", content: dockerImages },
  { courseSlug: "docker", lessonSlug: "compose", content: dockerCompose },
  { courseSlug: "docker", lessonSlug: "networking", content: dockerNetworking },
  { courseSlug: "docker", lessonSlug: "security", content: dockerSecurity },
  // Terraform
  { courseSlug: "terraform", lessonSlug: "introduction", content: terraformIntro },
  { courseSlug: "terraform", lessonSlug: "installation", content: terraformInstallation },
  { courseSlug: "terraform", lessonSlug: "resources", content: terraformResources },
  { courseSlug: "terraform", lessonSlug: "variables", content: terraformVariables },
  { courseSlug: "terraform", lessonSlug: "modules", content: terraformModules },
  { courseSlug: "terraform", lessonSlug: "state", content: terraformState },
];

export function getLessonContent(courseSlug: string, lessonSlug: string): LessonContent | undefined {
  return lessonsContent.find((l) => l.courseSlug === courseSlug && l.lessonSlug === lessonSlug);
}
