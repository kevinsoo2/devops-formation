export const gitopsIntro = `# Introduction au GitOps

## Qu'est-ce que le GitOps ?

Le **GitOps** est une approche opérationnelle qui utilise Git comme source unique de vérité pour l'infrastructure déclarative et les applications. Toute modification de l'infrastructure ou du déploiement passe par un commit Git.

## Principes fondamentaux

1. **Déclaratif** : L'ensemble du système est décrit de manière déclarative
2. **Versionné et immuable** : L'état désiré est stocké dans Git (historique complet)
3. **Récupéré automatiquement** : Les agents tirent (pull) l'état désiré depuis Git
4. **Réconciliation continue** : Les agents corrigent automatiquement les dérives

## Modèle Push vs Pull

| Aspect | Modèle Push | Modèle Pull |
|--------|------------|-------------|
| Déclencheur | Pipeline CI/CD pousse vers le cluster | Agent dans le cluster tire depuis Git |
| Sécurité | Credentials du cluster dans le CI | Pas de credentials exposés |
| Détection de dérive | Non native | Continue et automatique |
| Outils | Jenkins, GitLab CI | ArgoCD, Flux |
| Complexité | Plus simple à mettre en place | Plus robuste en production |

### Modèle Push (traditionnel)

\`\`\`bash
# Exemple de pipeline push classique
# Le CI/CD applique directement les manifestes
kubectl apply -f manifests/ --context production
\`\`\`

### Modèle Pull (GitOps)

\`\`\`yaml
# L'agent dans le cluster surveille le dépôt Git
# et applique automatiquement les changements
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mon-app
spec:
  source:
    repoURL: https://github.com/org/mon-app-config.git
    targetRevision: main
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
\`\`\`

## GitOps vs CI/CD traditionnel

| Critère | CI/CD Traditionnel | GitOps |
|---------|-------------------|--------|
| Source de vérité | Pipeline | Dépôt Git |
| Déploiement | Impératif (scripts) | Déclaratif (manifestes) |
| Rollback | Re-exécuter un ancien pipeline | git revert |
| Audit | Logs du CI | Historique Git |
| Dérive | Non détectée | Détectée et corrigée |
| Accès cluster | Partagé avec CI | Limité à l'agent |

## Outils GitOps principaux

### ArgoCD

- Interface web riche et intuitive
- Visualisation de l'arbre des ressources
- Support multi-cluster natif
- SSO et RBAC intégrés
- Hooks et sync waves

\`\`\`bash
# Installation rapide d'ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
\`\`\`

### Flux CD

- Approche modulaire (contrôleurs séparés)
- Intégration native avec les API Kubernetes
- Support de Kustomize et Helm natif
- Notifications intégrées

\`\`\`bash
# Installation de Flux
flux install

# Bootstrap avec un dépôt GitHub
flux bootstrap github \\
  --owner=mon-org \\
  --repository=fleet-infra \\
  --path=clusters/production \\
  --personal
\`\`\`

## Quand adopter le GitOps ?

- Vous gérez plusieurs environnements (dev, staging, prod)
- Vous avez besoin d'un audit complet des déploiements
- Votre équipe pratique déjà l'Infrastructure as Code
- Vous souhaitez des rollbacks rapides et fiables
- La sécurité du cluster est une priorité

## Exercices

1. Comparez les workflows push et pull en dessinant un diagramme pour chaque approche
2. Identifiez dans votre organisation actuelle quels composants bénéficieraient du GitOps
3. Listez les avantages et inconvénients du GitOps pour votre cas d'usage
4. Installez ArgoCD ou Flux dans un cluster de test et déployez une application simple
`;


export const gitopsArgocdInstall = `# Installation d'ArgoCD

## Prérequis

- Un cluster Kubernetes (v1.24+)
- kubectl configuré
- Accès administrateur au cluster
- Au moins 2 Go de RAM disponibles

## Déploiement sur Kubernetes

### Installation standard

\`\`\`bash
# Créer le namespace dédié
kubectl create namespace argocd

# Installer ArgoCD (version stable)
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Vérifier le déploiement
kubectl get pods -n argocd
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s
\`\`\`

### Installation haute disponibilité (production)

\`\`\`bash
# Pour un environnement de production
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml
\`\`\`

### Composants déployés

| Composant | Rôle |
|-----------|------|
| argocd-server | API et interface web |
| argocd-repo-server | Clone et analyse les dépôts Git |
| argocd-application-controller | Réconciliation des applications |
| argocd-redis | Cache pour les sessions |
| argocd-dex-server | Authentification SSO |

\`\`\`bash
# Vérifier tous les composants
kubectl get all -n argocd
\`\`\`

## Configuration du CLI

### Installation du CLI

\`\`\`bash
# Linux (AMD64)
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x argocd
sudo mv argocd /usr/local/bin/

# macOS (via Homebrew)
brew install argocd

# Vérifier l'installation
argocd version --client
\`\`\`

### Connexion au serveur

\`\`\`bash
# Récupérer le mot de passe initial admin
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port-forward pour accéder localement
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

# Se connecter via le CLI
argocd login localhost:8080 --username admin --password <mot-de-passe> --insecure

# Changer le mot de passe admin
argocd account update-password --current-password <ancien> --new-password <nouveau>
\`\`\`

## Accès à l'interface web

### Via Port-Forward (développement)

\`\`\`bash
# Accès local sur https://localhost:8080
kubectl port-forward svc/argocd-server -n argocd 8080:443
\`\`\`

### Via Ingress (production)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
  - host: argocd.mondomaine.fr
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 443
  tls:
  - hosts:
    - argocd.mondomaine.fr
    secretName: argocd-tls
\`\`\`

### Via LoadBalancer

\`\`\`bash
# Changer le type de service
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Récupérer l'IP externe
kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
\`\`\`

## Premier login et configuration

### Configuration initiale

\`\`\`bash
# Se connecter en tant qu'admin
argocd login argocd.mondomaine.fr --username admin

# Ajouter un dépôt Git
argocd repo add https://github.com/org/mon-repo.git --username git --password <token>

# Ajouter un dépôt privé via SSH
argocd repo add git@github.com:org/mon-repo.git --ssh-private-key-path ~/.ssh/id_rsa

# Ajouter un cluster distant
argocd cluster add mon-contexte-kube --name production

# Lister les clusters configurés
argocd cluster list
\`\`\`

### Désactiver le compte admin (recommandé en production)

\`\`\`bash
# Après avoir configuré SSO, désactiver admin
kubectl patch configmap argocd-cm -n argocd --type merge -p '{"data":{"admin.enabled":"false"}}'
\`\`\`

## Exercices

1. Installez ArgoCD sur un cluster Minikube ou Kind
2. Connectez-vous via le CLI et changez le mot de passe admin
3. Configurez un Ingress pour accéder à l'interface web
4. Ajoutez un dépôt Git public et un dépôt privé
5. Explorez l'interface web et identifiez les différentes sections
`;


export const gitopsArgocdApps = `# Applications ArgoCD

## Création d'une Application

Une Application ArgoCD représente un ensemble de ressources Kubernetes déployées à partir d'un dépôt Git.

### Via le CLI

\`\`\`bash
# Créer une application simple
argocd app create mon-app \\
  --repo https://github.com/org/mon-app.git \\
  --path manifests \\
  --dest-server https://kubernetes.default.svc \\
  --dest-namespace default \\
  --revision main

# Vérifier le statut
argocd app get mon-app

# Synchroniser manuellement
argocd app sync mon-app
\`\`\`

### Via un manifeste YAML

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mon-app
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/org/mon-app.git
    targetRevision: main
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

## Politiques de synchronisation (Sync Policies)

### Sync manuelle vs automatique

| Mode | Description | Cas d'usage |
|------|-------------|-------------|
| Manuel | Nécessite une action explicite | Production critique |
| Automatique | Se synchronise dès qu'un changement est détecté | Environnements dev/staging |

### Options de synchronisation

\`\`\`yaml
syncPolicy:
  automated:
    prune: true          # Supprimer les ressources absentes du Git
    selfHeal: true       # Corriger les modifications manuelles
    allowEmpty: false    # Empêcher la suppression de toutes les ressources
  syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    - ApplyOutOfSyncOnly=true
    - Validate=true
    - RespectIgnoreDifferences=true
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
\`\`\`

## Auto-Sync et Self-Healing

### Auto-Sync

L'auto-sync déclenche une synchronisation dès que l'état dans Git diverge de l'état dans le cluster.

\`\`\`bash
# Activer l'auto-sync sur une application existante
argocd app set mon-app --sync-policy automated

# Activer le pruning automatique
argocd app set mon-app --auto-prune

# Désactiver l'auto-sync
argocd app set mon-app --sync-policy none
\`\`\`

### Self-Healing

Le self-healing détecte et corrige les modifications manuelles faites directement dans le cluster.

\`\`\`bash
# Activer le self-heal
argocd app set mon-app --self-heal

# Exemple : si quelqu'un modifie manuellement un Deployment
kubectl scale deployment mon-app --replicas=10 -n production
# ArgoCD va automatiquement remettre le nombre de réplicas tel que défini dans Git
\`\`\`

## Health Checks (Vérifications de santé)

ArgoCD évalue la santé des ressources déployées.

### Statuts de santé

| Statut | Signification |
|--------|---------------|
| Healthy | Toutes les ressources fonctionnent correctement |
| Progressing | Déploiement en cours |
| Degraded | Certaines ressources en erreur |
| Suspended | Ressource volontairement suspendue |
| Missing | Ressource absente du cluster |
| Unknown | État non déterminable |

### Health check personnalisé

\`\`\`yaml
# Dans argocd-cm ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  resource.customizations.health.mycrd.io_MyResource: |
    hs = {}
    if obj.status ~= nil then
      if obj.status.phase == "Running" then
        hs.status = "Healthy"
        hs.message = "La ressource est en cours d'exécution"
      elseif obj.status.phase == "Failed" then
        hs.status = "Degraded"
        hs.message = obj.status.message
      else
        hs.status = "Progressing"
        hs.message = "En attente..."
      end
    end
    return hs
\`\`\`

## Hooks et Sync Waves

Les hooks permettent d'exécuter des actions à des moments précis du cycle de synchronisation.

### Types de hooks

| Hook | Moment d'exécution |
|------|-------------------|
| PreSync | Avant la synchronisation |
| Sync | Pendant la synchronisation |
| PostSync | Après la synchronisation réussie |
| SyncFail | Après un échec de synchronisation |
| Skip | Ressource ignorée pendant le sync |

### Exemple de hooks

\`\`\`yaml
# Migration de base de données avant le déploiement (PreSync)
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: mon-app:latest
        command: ["python", "manage.py", "migrate"]
      restartPolicy: Never
---
# Notification après déploiement réussi (PostSync)
apiVersion: batch/v1
kind: Job
metadata:
  name: notify-slack
  annotations:
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
spec:
  template:
    spec:
      containers:
      - name: notify
        image: curlimages/curl
        command:
        - curl
        - -X
        - POST
        - -d
        - '{"text":"Déploiement réussi !"}'
        - https://hooks.slack.com/services/XXX
      restartPolicy: Never
\`\`\`

### Sync Waves

Les sync waves contrôlent l'ordre de déploiement des ressources.

\`\`\`yaml
# Wave 0 - Namespace et ConfigMaps
apiVersion: v1
kind: Namespace
metadata:
  name: mon-app
  annotations:
    argocd.argoproj.io/sync-wave: "0"
---
# Wave 1 - Base de données
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  annotations:
    argocd.argoproj.io/sync-wave: "1"
---
# Wave 2 - Application
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
  annotations:
    argocd.argoproj.io/sync-wave: "2"
---
# Wave 3 - Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mon-app
  annotations:
    argocd.argoproj.io/sync-wave: "3"
\`\`\`

## Exercices

1. Créez une Application ArgoCD avec auto-sync activé
2. Testez le self-healing en modifiant manuellement une ressource dans le cluster
3. Mettez en place un hook PreSync pour exécuter des migrations
4. Configurez des sync waves pour un déploiement ordonné (namespace → DB → app → ingress)
5. Créez un health check personnalisé pour un CRD de votre choix
`;


export const gitopsRepoStructure = `# Structure de dépôt GitOps

## Organisation des dépôts

### Monorepo vs Multi-repo

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| Monorepo | Vue unifiée, simplicité | Permissions complexes, conflits |
| Multi-repo | Isolation, RBAC fin | Plus de repos à gérer |
| Hybride | Équilibre | Complexité moyenne |

### Structure recommandée (Monorepo)

\`\`\`bash
fleet-repo/
├── apps/                    # Définitions des Applications ArgoCD
│   ├── dev/
│   │   ├── app1.yaml
│   │   └── app2.yaml
│   ├── staging/
│   │   ├── app1.yaml
│   │   └── app2.yaml
│   └── production/
│       ├── app1.yaml
│       └── app2.yaml
├── base/                    # Manifestes de base (partagés)
│   ├── app1/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   └── app2/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── kustomization.yaml
├── overlays/                # Surcharges par environnement
│   ├── dev/
│   │   ├── app1/
│   │   │   ├── kustomization.yaml
│   │   │   └── patch-replicas.yaml
│   │   └── app2/
│   ├── staging/
│   └── production/
│       ├── app1/
│       │   ├── kustomization.yaml
│       │   ├── patch-replicas.yaml
│       │   └── patch-resources.yaml
│       └── app2/
└── infrastructure/          # Composants d'infrastructure
    ├── cert-manager/
    ├── ingress-nginx/
    └── monitoring/
\`\`\`

## Pattern App-of-Apps

Le pattern App-of-Apps utilise une Application ArgoCD parente qui gère d'autres Applications enfants.

### Application racine

\`\`\`yaml
# apps/root-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/fleet-repo.git
    targetRevision: main
    path: apps/production
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

### Applications enfants

\`\`\`yaml
# apps/production/app1.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app1-production
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/org/fleet-repo.git
    targetRevision: main
    path: overlays/production/app1
  destination:
    server: https://kubernetes.default.svc
    namespace: app1
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

## Kustomize avec ArgoCD

### Base Kustomize

\`\`\`yaml
# base/app1/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
  - configmap.yaml
commonLabels:
  app: mon-app
  managed-by: argocd
\`\`\`

### Overlay de production

\`\`\`yaml
# overlays/production/app1/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/app1
namePrefix: prod-
namespace: production
patches:
  - path: patch-replicas.yaml
  - path: patch-resources.yaml
images:
  - name: mon-app
    newName: registry.example.com/mon-app
    newTag: v2.1.0
\`\`\`

\`\`\`yaml
# overlays/production/app1/patch-replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 5
\`\`\`

\`\`\`yaml
# overlays/production/app1/patch-resources.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  template:
    spec:
      containers:
      - name: mon-app
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
\`\`\`

## Helm avec ArgoCD

### Application Helm depuis un chart registry

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: prometheus
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://prometheus-community.github.io/helm-charts
    chart: kube-prometheus-stack
    targetRevision: 45.0.0
    helm:
      releaseName: prometheus
      values: |
        grafana:
          enabled: true
          adminPassword: mon-mot-de-passe
        prometheus:
          prometheusSpec:
            retention: 30d
            storageSpec:
              volumeClaimTemplate:
                spec:
                  accessModes: ["ReadWriteOnce"]
                  resources:
                    requests:
                      storage: 50Gi
  destination:
    server: https://kubernetes.default.svc
    namespace: monitoring
  syncPolicy:
    automated:
      prune: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

### Helm avec fichier values dans le dépôt

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mon-app-helm
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/fleet-repo.git
    targetRevision: main
    path: charts/mon-app
    helm:
      valueFiles:
        - values-production.yaml
      parameters:
        - name: image.tag
          value: "v1.5.0"
  destination:
    server: https://kubernetes.default.svc
    namespace: production
\`\`\`

## Exercices

1. Créez une structure de dépôt monorepo avec base et overlays pour 3 environnements
2. Implémentez le pattern App-of-Apps avec une application racine
3. Configurez Kustomize pour gérer les différences entre dev et production
4. Déployez un chart Helm (nginx-ingress) via ArgoCD avec des values personnalisés
5. Migrez une application existante vers la structure GitOps recommandée
`;


export const gitopsSecrets = `# Gestion des Secrets en GitOps

## Le défi des secrets en GitOps

En GitOps, tout doit être dans Git. Mais les secrets (mots de passe, clés API, certificats) ne doivent **jamais** être stockés en clair dans un dépôt Git. Plusieurs solutions existent pour résoudre ce problème.

## Comparaison des solutions

| Solution | Complexité | Sécurité | Rotation | Cloud-agnostic |
|----------|-----------|----------|----------|----------------|
| Sealed Secrets | Faible | Bonne | Manuelle | Oui |
| External Secrets | Moyenne | Très bonne | Automatique | Oui |
| SOPS | Faible | Bonne | Manuelle | Oui |
| Vault + ESO | Élevée | Excellente | Automatique | Oui |

## Sealed Secrets (Bitnami)

Sealed Secrets chiffre les secrets côté client pour les stocker en sécurité dans Git.

### Installation

\`\`\`bash
# Installer le contrôleur dans le cluster
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Installer kubeseal (CLI)
brew install kubeseal
# ou
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-0.24.0-linux-amd64.tar.gz
tar -xvzf kubeseal-0.24.0-linux-amd64.tar.gz
sudo mv kubeseal /usr/local/bin/
\`\`\`

### Utilisation

\`\`\`bash
# Créer un secret Kubernetes classique
kubectl create secret generic db-credentials \\
  --from-literal=username=admin \\
  --from-literal=password=SuperS3cret! \\
  --dry-run=client -o yaml > secret.yaml

# Chiffrer avec kubeseal
kubeseal --format yaml < secret.yaml > sealed-secret.yaml

# Le sealed-secret.yaml peut être commité dans Git en toute sécurité
cat sealed-secret.yaml
\`\`\`

\`\`\`yaml
# Résultat : SealedSecret (peut être stocké dans Git)
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: db-credentials
  namespace: production
spec:
  encryptedData:
    username: AgBy8hCi...  # chiffré
    password: AgCtr4kS...  # chiffré
  template:
    metadata:
      name: db-credentials
      namespace: production
    type: Opaque
\`\`\`

## External Secrets Operator (ESO)

ESO synchronise les secrets depuis un gestionnaire externe vers des Secrets Kubernetes.

### Installation

\`\`\`bash
# Via Helm
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \\
  -n external-secrets --create-namespace
\`\`\`

### Configuration avec AWS Secrets Manager

\`\`\`yaml
# SecretStore - connexion au provider
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets
  namespace: production
spec:
  provider:
    aws:
      service: SecretsManager
      region: eu-west-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
# ExternalSecret - récupération du secret
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets
    kind: SecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
    - secretKey: username
      remoteRef:
        key: production/db
        property: username
    - secretKey: password
      remoteRef:
        key: production/db
        property: password
\`\`\`

### Configuration avec HashiCorp Vault

\`\`\`yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-store
  namespace: production
spec:
  provider:
    vault:
      server: "https://vault.example.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "external-secrets"
          serviceAccountRef:
            name: external-secrets-sa
\`\`\`

## SOPS (Mozilla)

SOPS chiffre les fichiers de configuration en ne chiffrant que les valeurs (pas les clés).

### Installation et configuration

\`\`\`bash
# Installer SOPS
brew install sops
# ou
wget https://github.com/getsops/sops/releases/download/v3.8.0/sops-v3.8.0.linux.amd64
chmod +x sops-v3.8.0.linux.amd64
sudo mv sops-v3.8.0.linux.amd64 /usr/local/bin/sops

# Créer une clé AGE (alternative à PGP)
age-keygen -o key.txt
# Exporter la clé publique
export SOPS_AGE_RECIPIENTS=$(cat key.txt | grep "public key" | awk '{print $4}')
\`\`\`

### Chiffrement avec SOPS

\`\`\`bash
# Fichier .sops.yaml à la racine du dépôt
cat > .sops.yaml << EOF
creation_rules:
  - path_regex: secrets/.*\\.yaml
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
  - path_regex: secrets/.*\\.env
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
EOF

# Chiffrer un fichier
sops --encrypt secrets/db.yaml > secrets/db.enc.yaml

# Déchiffrer pour lecture
sops --decrypt secrets/db.enc.yaml

# Éditer un fichier chiffré directement
sops secrets/db.enc.yaml
\`\`\`

### SOPS avec ArgoCD

\`\`\`bash
# Installer le plugin SOPS pour ArgoCD
# Dans le configmap argocd-cm
kubectl edit configmap argocd-cm -n argocd
\`\`\`

\`\`\`yaml
# Configuration du plugin dans argocd-cm
data:
  configManagementPlugins: |
    - name: sops
      generate:
        command: ["bash", "-c"]
        args: ["sops -d secret.enc.yaml"]
\`\`\`

## Intégration avec HashiCorp Vault

### Architecture Vault + Kubernetes

\`\`\`bash
# Installer Vault via Helm
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install vault hashicorp/vault \\
  --set "server.dev.enabled=true" \\
  -n vault --create-namespace

# Configurer l'authentification Kubernetes
vault auth enable kubernetes
vault write auth/kubernetes/config \\
  kubernetes_host="https://kubernetes.default.svc"
\`\`\`

### Politique et rôle Vault

\`\`\`bash
# Créer une politique
vault policy write app-policy - <<EOF
path "secret/data/production/*" {
  capabilities = ["read"]
}
EOF

# Créer un rôle pour le ServiceAccount
vault write auth/kubernetes/role/app-role \\
  bound_service_account_names=app-sa \\
  bound_service_account_namespaces=production \\
  policies=app-policy \\
  ttl=1h
\`\`\`

## Exercices

1. Installez Sealed Secrets et chiffrez un secret pour votre application
2. Configurez External Secrets Operator avec un provider de votre choix
3. Chiffrez un fichier de configuration avec SOPS et intégrez-le dans ArgoCD
4. Mettez en place une rotation automatique de secrets avec ESO (refreshInterval)
5. Comparez les workflows de chaque solution et choisissez celle adaptée à votre contexte
`;


export const gitopsAdvanced = `# GitOps Avancé

## Gestion Multi-Cluster

### Ajouter des clusters à ArgoCD

\`\`\`bash
# Lister les contextes Kubernetes disponibles
kubectl config get-contexts

# Ajouter un cluster à ArgoCD
argocd cluster add cluster-staging --name staging
argocd cluster add cluster-production --name production

# Lister les clusters gérés
argocd cluster list
\`\`\`

### Déployer sur un cluster spécifique

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app-staging
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/fleet-repo.git
    targetRevision: main
    path: overlays/staging/app1
  destination:
    # Référencer le cluster par son URL ou son nom
    server: https://staging-api.example.com
    namespace: app1
\`\`\`

### AppProject pour le multi-cluster

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: equipe-backend
  namespace: argocd
spec:
  description: Projet pour l'équipe backend
  sourceRepos:
    - 'https://github.com/org/backend-*'
  destinations:
    - namespace: 'backend-*'
      server: https://staging-api.example.com
    - namespace: 'backend-*'
      server: https://production-api.example.com
  clusterResourceWhitelist:
    - group: ''
      kind: Namespace
  namespaceResourceBlacklist:
    - group: ''
      kind: ResourceQuota
  roles:
    - name: admin
      policies:
        - p, proj:equipe-backend:admin, applications, *, equipe-backend/*, allow
      groups:
        - backend-team
\`\`\`

## ApplicationSets

Les ApplicationSets permettent de générer automatiquement des Applications à partir de templates.

### Générateur List

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: mon-app-envs
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - cluster: dev
            url: https://dev-api.example.com
            revision: develop
          - cluster: staging
            url: https://staging-api.example.com
            revision: release
          - cluster: production
            url: https://prod-api.example.com
            revision: main
  template:
    metadata:
      name: 'mon-app-{{cluster}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/org/fleet-repo.git
        targetRevision: '{{revision}}'
        path: 'overlays/{{cluster}}/mon-app'
      destination:
        server: '{{url}}'
        namespace: mon-app
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
\`\`\`

### Générateur Git Directory

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: apps-from-dirs
  namespace: argocd
spec:
  generators:
    - git:
        repoURL: https://github.com/org/fleet-repo.git
        revision: main
        directories:
          - path: apps/*
          - path: apps/excluded-app
            exclude: true
  template:
    metadata:
      name: '{{path.basename}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/org/fleet-repo.git
        targetRevision: main
        path: '{{path}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: '{{path.basename}}'
      syncPolicy:
        automated:
          prune: true
        syncOptions:
          - CreateNamespace=true
\`\`\`

### Générateur Cluster

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: monitoring-all-clusters
  namespace: argocd
spec:
  generators:
    - clusters:
        selector:
          matchLabels:
            environment: production
  template:
    metadata:
      name: 'monitoring-{{name}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/org/fleet-repo.git
        targetRevision: main
        path: infrastructure/monitoring
      destination:
        server: '{{server}}'
        namespace: monitoring
\`\`\`

## Progressive Delivery avec Argo Rollouts

Argo Rollouts étend les capacités de déploiement Kubernetes avec des stratégies avancées.

### Installation

\`\`\`bash
# Installer Argo Rollouts
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

# Installer le plugin kubectl
brew install argoproj/tap/kubectl-argo-rollouts
# ou
curl -LO https://github.com/argoproj/argo-rollouts/releases/latest/download/kubectl-argo-rollouts-linux-amd64
chmod +x kubectl-argo-rollouts-linux-amd64
sudo mv kubectl-argo-rollouts-linux-amd64 /usr/local/bin/kubectl-argo-rollouts
\`\`\`

### Canary Deployment

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: mon-app
  namespace: production
spec:
  replicas: 10
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
      - name: mon-app
        image: registry.example.com/mon-app:v2.0.0
        ports:
        - containerPort: 8080
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 5m}
      - setWeight: 30
      - pause: {duration: 5m}
      - setWeight: 50
      - pause: {duration: 10m}
      - setWeight: 80
      - pause: {duration: 5m}
      # Passe automatiquement à 100% si tout va bien
      canaryService: mon-app-canary
      stableService: mon-app-stable
      trafficRouting:
        nginx:
          stableIngress: mon-app-ingress
\`\`\`

### Blue-Green Deployment

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: mon-app-bluegreen
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
      - name: mon-app
        image: registry.example.com/mon-app:v2.0.0
  strategy:
    blueGreen:
      activeService: mon-app-active
      previewService: mon-app-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 300
      prePromotionAnalysis:
        templates:
        - templateName: smoke-tests
        args:
        - name: service-name
          value: mon-app-preview
\`\`\`

### Analysis Templates (tests automatisés)

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: smoke-tests
spec:
  args:
    - name: service-name
  metrics:
    - name: taux-erreur
      interval: 1m
      count: 5
      successCondition: result[0] < 0.05
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus.monitoring:9090
          query: |
            sum(rate(http_requests_total{service="{{args.service-name}}",status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total{service="{{args.service-name}}"}[5m]))
    - name: latence-p99
      interval: 1m
      count: 5
      successCondition: result[0] < 500
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus.monitoring:9090
          query: |
            histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="{{args.service-name}}"}[5m])) by (le))
\`\`\`

## Image Updater

Argo CD Image Updater met à jour automatiquement les tags d'images dans les Applications.

### Installation

\`\`\`bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj-labs/argocd-image-updater/stable/manifests/install.yaml
\`\`\`

### Configuration

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mon-app
  namespace: argocd
  annotations:
    argocd-image-updater.argoproj.io/image-list: app=registry.example.com/mon-app
    argocd-image-updater.argoproj.io/app.update-strategy: semver
    argocd-image-updater.argoproj.io/app.semver-constraint: ">=1.0.0 <2.0.0"
    argocd-image-updater.argoproj.io/write-back-method: git
    argocd-image-updater.argoproj.io/git-branch: main
spec:
  source:
    repoURL: https://github.com/org/fleet-repo.git
    targetRevision: main
    path: overlays/production/mon-app
  destination:
    server: https://kubernetes.default.svc
    namespace: production
\`\`\`

### Stratégies de mise à jour

| Stratégie | Description | Exemple |
|-----------|-------------|---------|
| semver | Suit le versionnement sémantique | >=1.0.0 <2.0.0 |
| latest | Dernière image par date | N/A |
| name | Tri alphabétique des tags | N/A |
| digest | Mise à jour sur changement de digest | N/A |

\`\`\`bash
# Vérifier les mises à jour disponibles
kubectl logs -n argocd deployment/argocd-image-updater

# Forcer une vérification
kubectl annotate application mon-app -n argocd \\
  argocd-image-updater.argoproj.io/force-update=true
\`\`\`

## Exercices

1. Configurez ArgoCD pour gérer 3 clusters (dev, staging, production)
2. Créez un ApplicationSet qui déploie automatiquement chaque dossier du dépôt Git
3. Mettez en place un Canary deployment avec Argo Rollouts et des tests Prometheus
4. Configurez Image Updater pour suivre les nouvelles versions d'une image
5. Implémentez un Blue-Green deployment avec promotion manuelle et tests automatisés
`;
