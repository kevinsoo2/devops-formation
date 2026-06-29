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
│  Control Node   │  ← Machine depuis laquelle vous lancez Ansible
└───────┬─────────┘
        │ SSH
        ├────────────┐────────────┐
        ▼            ▼            ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Node 1    │ │  Node 2    │ │  Node 3    │
└────────────┘ └────────────┘ └────────────┘
\`\`\`

## Concepts fondamentaux

### 1. Inventaire (Inventory)
\`\`\`ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com

[all:vars]
ansible_user=admin
\`\`\`

### 2. Modules
Les modules sont les "outils" d'Ansible :
- \`apt\` / \`yum\` : installer des paquets
- \`copy\` : copier des fichiers
- \`service\` : gérer des services
- \`template\` : déployer des fichiers avec des variables

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
| **Agentless** | Pas besoin d'agent sur les machines cibles |
| **SSH** | Utilise SSH, déjà présent sur les serveurs |
| **YAML** | Syntaxe simple et lisible |
| **Idempotent** | Peut être relancé sans risque |

## Exercice pratique

> **Exercice** : Vérifiez que vous pouvez vous connecter en SSH à une machine distante.

\`\`\`bash
ssh user@votre-serveur "echo 'Connexion réussie !'"
\`\`\`
`;

const k8sIntro = `# Introduction à Kubernetes

## Qu'est-ce que Kubernetes ?

Kubernetes (K8s) est une plateforme d'orchestration de conteneurs open-source développée par Google.

- **Déployer** des applications conteneurisées
- **Scaler** automatiquement selon la charge
- **Guérir** automatiquement les applications en panne

## Architecture de Kubernetes

### Composants du Control Plane

| Composant | Rôle |
|-----------|------|
| **API Server** | Point d'entrée de toutes les requêtes |
| **etcd** | Base de données clé-valeur (état du cluster) |
| **Scheduler** | Décide sur quel noeud placer un Pod |
| **Controller Manager** | Maintient l'état souhaité |

### Composants des Noeuds

| Composant | Rôle |
|-----------|------|
| **kubelet** | Agent qui gère les Pods sur le noeud |
| **kube-proxy** | Gère le réseau et le load balancing |
| **Container Runtime** | Exécute les conteneurs (containerd, CRI-O) |

## Objets Kubernetes essentiels

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

### Service
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: mon-app-service
spec:
  selector:
    app: mon-app
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
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

> **Exercice** : Utilisez [Killercoda](https://killercoda.com) pour lancer un cluster K8s gratuit et déployer votre premier Pod.
`;

const rhelIntro = `# Introduction à Red Hat Enterprise Linux

## Qu'est-ce que RHEL ?

Red Hat Enterprise Linux (RHEL) est la distribution Linux la plus utilisée en entreprise.

- **Stabilité** : cycles de support de 10 ans
- **Sécurité** : certifications (Common Criteria, FIPS)
- **Support** : support professionnel Red Hat

## Certifications Red Hat

| Certification | Niveau | Description |
|---------------|--------|-------------|
| **RHCSA** | Fondamental | Administration système de base |
| **RHCE** | Avancé | Automatisation avec Ansible |
| **RHCA** | Expert | Spécialisations multiples |

## Commandes de base

### Gestion des paquets (dnf)
\`\`\`bash
dnf search httpd
sudo dnf install httpd -y
sudo dnf update -y
dnf list installed
\`\`\`

### Gestion des utilisateurs
\`\`\`bash
sudo useradd -m -s /bin/bash devops
sudo passwd devops
sudo usermod -aG wheel devops
\`\`\`

### Gestion des services (systemd)
\`\`\`bash
sudo systemctl start httpd
sudo systemctl enable httpd
systemctl status httpd
systemctl list-units --type=service
\`\`\`

## Arborescence Linux

\`\`\`
/
├── /etc/        → Configuration système
├── /var/        → Données variables (logs)
├── /home/       → Répertoires utilisateurs
├── /opt/        → Logiciels tiers
├── /tmp/        → Fichiers temporaires
├── /usr/        → Programmes et bibliothèques
└── /proc/       → Système de fichiers virtuel
\`\`\`

## Exercice pratique

> **Exercice** : Sur un système Linux, créez un utilisateur et installez vim.

\`\`\`bash
sudo useradd -m formation
sudo dnf install vim -y
sudo mkdir -p /opt/formation
echo "DevOps Ready!" | sudo tee /opt/formation/hello.txt
\`\`\`
`;

export const lessonsContent: LessonContent[] = [
  { courseSlug: "ansible", lessonSlug: "introduction", content: ansibleIntro },
  { courseSlug: "kubernetes", lessonSlug: "introduction", content: k8sIntro },
  { courseSlug: "redhat", lessonSlug: "introduction", content: rhelIntro },
];

export function getLessonContent(courseSlug: string, lessonSlug: string): LessonContent | undefined {
  return lessonsContent.find((l) => l.courseSlug === courseSlug && l.lessonSlug === lessonSlug);
}
