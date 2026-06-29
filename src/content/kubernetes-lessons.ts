export const k8sPods = `# Pods et Conteneurs

## Qu'est-ce qu'un Pod ?

Un Pod est la plus petite unité déployable dans Kubernetes. Il représente un ou plusieurs conteneurs qui partagent :
- Le même espace réseau (même adresse IP)
- Le même stockage (volumes partagés)
- Le même cycle de vie (créés et détruits ensemble)

## Créer un Pod simple

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-premier-pod
  labels:
    app: demo
    environment: development
spec:
  containers:
    - name: nginx
      image: nginx:1.25
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
\`\`\`

## Commandes Pod essentielles

\`\`\`bash
# Créer un pod depuis un fichier YAML
kubectl apply -f pod.yaml

# Créer un pod rapidement (mode impératif)
kubectl run nginx-test --image=nginx:1.25 --port=80

# Lister les pods
kubectl get pods
kubectl get pods -o wide
kubectl get pods --all-namespaces

# Détails complets d'un pod
kubectl describe pod mon-premier-pod

# Logs d'un pod
kubectl logs mon-premier-pod
kubectl logs -f mon-premier-pod          # Follow en temps réel
kubectl logs mon-premier-pod -c nginx    # Conteneur spécifique
kubectl logs --previous mon-premier-pod  # Logs du conteneur précédent

# Exécuter une commande dans un pod
kubectl exec -it mon-premier-pod -- /bin/bash
kubectl exec mon-premier-pod -- ls /etc/nginx

# Port-forward pour accéder localement
kubectl port-forward mon-premier-pod 8080:80

# Supprimer un pod
kubectl delete pod mon-premier-pod
kubectl delete pod mon-premier-pod --grace-period=0 --force
\`\`\`


## Pod multi-conteneurs

### Pattern Sidecar
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-sidecar
spec:
  containers:
    - name: app
      image: nginx:1.25
      ports:
        - containerPort: 80
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx
    - name: log-collector
      image: busybox:1.36
      command: ['sh', '-c', 'tail -f /var/log/nginx/access.log']
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx
  volumes:
    - name: shared-logs
      emptyDir: {}
\`\`\`

### Pattern Init Container
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-init
spec:
  initContainers:
    - name: init-db-check
      image: busybox:1.36
      command: ['sh', '-c', 'until nslookup db-service; do echo waiting for db; sleep 2; done']
    - name: init-schema
      image: postgres:15
      command: ['sh', '-c', 'psql -h db-service -U admin -f /scripts/schema.sql']
  containers:
    - name: app
      image: myapp:latest
      ports:
        - containerPort: 8080
\`\`\`

## Probes (Sondes de santé)

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-probes
spec:
  containers:
    - name: app
      image: myapp:latest
      ports:
        - containerPort: 8080
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 5
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 3
      startupProbe:
        httpGet:
          path: /healthz
          port: 8080
        failureThreshold: 30
        periodSeconds: 10
\`\`\`


## Cycle de vie d'un Pod

| Phase | Description |
|-------|-------------|
| **Pending** | Pod accepté par le cluster, conteneurs pas encore démarrés |
| **Running** | Au moins un conteneur est en cours d'exécution |
| **Succeeded** | Tous les conteneurs ont terminé avec succès (exit 0) |
| **Failed** | Au moins un conteneur a échoué (exit != 0) |
| **Unknown** | État impossible à déterminer (problème de communication) |

## Patterns multi-conteneurs

| Pattern | Usage | Exemple |
|---------|-------|---------|
| **Sidecar** | Fonctionnalité complémentaire | Log collector, proxy |
| **Ambassador** | Proxy vers l'extérieur | Connection pooling DB |
| **Adapter** | Transformer les données | Reformater les logs |
| **Init Container** | Initialisation avant démarrage | Migration DB, attente dépendance |

## Bonnes pratiques

- Toujours définir des **resource requests et limits**
- Utiliser des **labels** pour organiser les pods
- Configurer des **probes** (liveness, readiness, startup)
- Préférer les **Deployments** aux Pods seuls en production
- Utiliser des **tags d'image spécifiques** (pas \`latest\`)

## Exercice pratique

> **TP** : Créez un pod avec deux conteneurs :
> 1. Un conteneur nginx servant une page web
> 2. Un conteneur sidecar qui écrit la date toutes les 5 secondes dans un fichier partagé
> 3. Configurez un volume partagé entre les deux conteneurs
> 4. Ajoutez une livenessProbe et une readinessProbe sur le conteneur nginx
> 5. Vérifiez les logs des deux conteneurs avec \`kubectl logs\`
`;


export const k8sDeployments = `# Deployments et Services

## Pourquoi les Deployments ?

Un Deployment est un objet de haut niveau qui gère :
- Le nombre de **réplicas** de votre application
- Les **mises à jour progressives** (rolling update)
- Le **rollback** automatique en cas de problème
- L'**auto-healing** des pods défaillants

## Créer un Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: webapp
        version: v1
    spec:
      containers:
        - name: webapp
          image: nginx:1.25
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "250m"
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
\`\`\`


## Les Services

Un Service expose vos Pods sur le réseau et assure le load balancing.

### ClusterIP (interne au cluster)
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: ClusterIP
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
\`\`\`

### NodePort (accessible depuis l'extérieur via le port du noeud)
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-nodeport
spec:
  type: NodePort
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
\`\`\`

### LoadBalancer (cloud provider)
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
spec:
  type: LoadBalancer
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
\`\`\`

### ExternalName (alias DNS)
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: db.example.com
\`\`\`

## Comparaison des types de Service

| Type | Accès | Port | Cas d'usage |
|------|-------|------|-------------|
| **ClusterIP** | Interne uniquement | Port cluster | Communication inter-services |
| **NodePort** | Externe via IP noeud | 30000-32767 | Dev, tests, accès direct |
| **LoadBalancer** | Externe via LB cloud | Port standard | Production cloud |
| **ExternalName** | DNS alias | N/A | Référencer un service externe |


## Stratégies de déploiement

### Rolling Update (par défaut)
\`\`\`yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%        # Pods supplémentaires pendant la mise à jour
    maxUnavailable: 25%  # Pods pouvant être indisponibles
\`\`\`

### Recreate (tout couper puis relancer)
\`\`\`yaml
strategy:
  type: Recreate  # Downtime, mais pas de version mixte
\`\`\`

## Commandes essentielles

\`\`\`bash
# Créer/mettre à jour un deployment
kubectl apply -f deployment.yaml

# Scaler le nombre de réplicas
kubectl scale deployment webapp --replicas=5

# Autoscaling basé sur le CPU
kubectl autoscale deployment webapp --min=2 --max=10 --cpu-percent=80

# Mise à jour de l'image
kubectl set image deployment/webapp webapp=nginx:1.26

# Voir le statut du rollout
kubectl rollout status deployment/webapp

# Voir l'historique des rollouts
kubectl rollout history deployment/webapp
kubectl rollout history deployment/webapp --revision=2

# Rollback à la version précédente
kubectl rollout undo deployment/webapp

# Rollback à une révision spécifique
kubectl rollout undo deployment/webapp --to-revision=3

# Pause/Resume d'un rollout
kubectl rollout pause deployment/webapp
kubectl rollout resume deployment/webapp
\`\`\`

## HorizontalPodAutoscaler (HPA)

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: webapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: webapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
\`\`\`

## Exercice pratique

> **TP** : 
> 1. Créez un Deployment avec 3 réplicas de nginx:1.24
> 2. Exposez-le avec un Service NodePort sur le port 30080
> 3. Faites un rolling update vers nginx:1.25
> 4. Vérifiez le rollout avec \`kubectl rollout status\`
> 5. Effectuez un rollback vers la version précédente
> 6. Configurez un HPA avec min=2, max=8, target CPU 70%
`;


export const k8sNetworking = `# Networking dans Kubernetes

## Modèle réseau de Kubernetes

Kubernetes impose un modèle réseau plat :
- Chaque Pod reçoit sa propre adresse IP
- Les Pods peuvent communiquer entre eux sans NAT
- Les agents sur un noeud peuvent communiquer avec tous les Pods

## Communication entre Services

### DNS interne
Chaque Service obtient un enregistrement DNS automatique :
\`\`\`
<service-name>.<namespace>.svc.cluster.local
\`\`\`

\`\`\`bash
# Depuis un Pod, accéder à un service dans le même namespace
curl http://webapp-service:80

# Accéder à un service dans un autre namespace
curl http://webapp-service.production.svc.cluster.local:80
\`\`\`

### Exemple de communication inter-services
\`\`\`yaml
# Backend API
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api
  ports:
    - port: 3000
      targetPort: 3000
---
# Frontend qui appelle l'API
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: frontend:latest
          env:
            - name: API_URL
              value: "http://api-service:3000"
\`\`\`


## Ingress

Un Ingress gère l'accès HTTP/HTTPS externe vers les Services du cluster.

### Ingress simple
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: webapp-service
                port:
                  number: 80
\`\`\`

### Ingress avec TLS et routes multiples
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.example.com
        - api.example.com
      secretName: tls-secret
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-v1-service
                port:
                  number: 3000
          - path: /v2
            pathType: Prefix
            backend:
              service:
                name: api-v2-service
                port:
                  number: 3000
\`\`\`


## Network Policies

Les Network Policies contrôlent le trafic réseau entre les Pods.

### Refuser tout le trafic entrant par défaut
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
\`\`\`

### Autoriser le trafic uniquement depuis certains Pods
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 3000
\`\`\`

### Restreindre le trafic sortant
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-egress
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
    - to:  # Autoriser le DNS
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53
\`\`\`


## Commandes réseau utiles

\`\`\`bash
# Lister les services
kubectl get svc -A

# Voir les endpoints d'un service
kubectl get endpoints webapp-service

# Lister les ingress
kubectl get ingress

# Décrire un ingress
kubectl describe ingress webapp-ingress

# Lister les network policies
kubectl get networkpolicy -n production

# Tester la connectivité depuis un pod
kubectl exec -it debug-pod -- curl http://webapp-service:80
kubectl exec -it debug-pod -- nslookup webapp-service

# Créer un pod de debug réseau
kubectl run nettools --image=nicolaka/netshoot -it --rm -- /bin/bash
\`\`\`

## Comparaison des solutions réseau

| Solution | Type | Fonctionnalités |
|----------|------|-----------------|
| **Calico** | CNI + Network Policy | Performances, BGP, Network Policies avancées |
| **Cilium** | CNI + eBPF | Observabilité L7, encryption, Network Policies |
| **Flannel** | CNI simple | Simple, VXLAN overlay, pas de Network Policies |
| **Weave** | CNI | Encryption, DNS, multicast |
| **NGINX Ingress** | Ingress Controller | L7 routing, SSL, rate limiting |
| **Traefik** | Ingress Controller | Auto-discovery, Let's Encrypt, middleware |

## Exercice pratique

> **TP** :
> 1. Déployez un frontend et un backend avec leurs Services
> 2. Créez un Ingress qui route /api vers le backend et / vers le frontend
> 3. Appliquez une Network Policy qui n'autorise que le frontend à accéder au backend
> 4. Vérifiez avec un pod de test que l'accès direct au backend est bloqué
> 5. Testez la résolution DNS entre namespaces
`;


export const k8sStorage = `# Stockage Persistant

## Le problème du stockage dans Kubernetes

Par défaut, les données d'un conteneur sont **éphémères**. Quand un Pod est supprimé, ses données disparaissent. Le stockage persistant permet de conserver les données au-delà du cycle de vie d'un Pod.

## Volumes de base

### emptyDir (stockage temporaire partagé entre conteneurs)
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-storage
spec:
  containers:
    - name: writer
      image: busybox
      command: ['sh', '-c', 'echo "Hello" > /data/message.txt && sleep 3600']
      volumeMounts:
        - name: shared-data
          mountPath: /data
    - name: reader
      image: busybox
      command: ['sh', '-c', 'cat /data/message.txt && sleep 3600']
      volumeMounts:
        - name: shared-data
          mountPath: /data
  volumes:
    - name: shared-data
      emptyDir: {}
\`\`\`

### hostPath (montage depuis le noeud - déconseillé en production)
\`\`\`yaml
volumes:
  - name: host-data
    hostPath:
      path: /var/data
      type: DirectoryOrCreate
\`\`\`

## PersistentVolume (PV) et PersistentVolumeClaim (PVC)

### PersistentVolume (provisionné par l'admin)
\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-database
  labels:
    type: ssd
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /mnt/data/db
\`\`\`

### PersistentVolumeClaim (demandé par le développeur)
\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-storage-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
\`\`\`

### Utiliser un PVC dans un Pod
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: database
spec:
  containers:
    - name: postgres
      image: postgres:15
      env:
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
      volumeMounts:
        - name: db-data
          mountPath: /var/lib/postgresql/data
  volumes:
    - name: db-data
      persistentVolumeClaim:
        claimName: db-storage-claim
\`\`\`


## StorageClass (provisionnement dynamique)

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iopsPerGB: "3000"
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Delete
allowVolumeExpansion: true
\`\`\`

### PVC avec provisionnement dynamique
\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-storage
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi
\`\`\`

## ConfigMaps

### Créer un ConfigMap
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  APP_PORT: "8080"
  LOG_LEVEL: info
  nginx.conf: |
    server {
      listen 80;
      server_name localhost;
      location / {
        proxy_pass http://backend:3000;
      }
    }
\`\`\`

### Utiliser un ConfigMap
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:latest
      # En tant que variables d'environnement
      envFrom:
        - configMapRef:
            name: app-config
      # Ou variables individuelles
      env:
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_PORT
      # En tant que fichier monté
      volumeMounts:
        - name: config-volume
          mountPath: /etc/nginx/conf.d
  volumes:
    - name: config-volume
      configMap:
        name: app-config
        items:
          - key: nginx.conf
            path: default.conf
\`\`\`


## Secrets

### Créer un Secret
\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=          # echo -n "admin" | base64
  password: UEBzc3cwcmQxMjM=  # echo -n "P@ssw0rd123" | base64
---
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-cert>
  tls.key: <base64-encoded-key>
\`\`\`

### Utiliser un Secret
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-secrets
spec:
  containers:
    - name: app
      image: myapp:latest
      env:
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
      volumeMounts:
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
  volumes:
    - name: secret-volume
      secret:
        secretName: db-credentials
\`\`\`

### Créer un Secret via kubectl
\`\`\`bash
# Depuis des valeurs littérales
kubectl create secret generic db-creds \\
  --from-literal=username=admin \\
  --from-literal=password=P@ssw0rd123

# Depuis un fichier
kubectl create secret generic tls-cert \\
  --from-file=tls.crt=./cert.pem \\
  --from-file=tls.key=./key.pem

# Depuis un fichier .env
kubectl create secret generic app-secrets \\
  --from-env-file=.env.production
\`\`\`

## Comparaison des options de stockage

| Type | Persistance | Cas d'usage | Scope |
|------|-------------|-------------|-------|
| **emptyDir** | Non (vie du Pod) | Cache, fichiers temp partagés | Pod |
| **hostPath** | Oui (sur le noeud) | Dev/test, DaemonSets | Noeud |
| **PV/PVC** | Oui | Bases de données, fichiers | Cluster |
| **ConfigMap** | Oui | Configuration app | Namespace |
| **Secret** | Oui | Credentials, certificats | Namespace |
| **StorageClass** | Oui (dynamique) | Provisionnement automatique | Cluster |

## Commandes utiles

\`\`\`bash
# PersistentVolumes
kubectl get pv
kubectl describe pv pv-database

# PersistentVolumeClaims
kubectl get pvc
kubectl describe pvc db-storage-claim

# StorageClasses
kubectl get storageclass

# ConfigMaps
kubectl get configmap
kubectl describe configmap app-config
kubectl create configmap app-config --from-file=config/

# Secrets
kubectl get secrets
kubectl describe secret db-credentials
kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 -d
\`\`\`

## Exercice pratique

> **TP** :
> 1. Créez un StorageClass et un PVC de 1Gi
> 2. Déployez PostgreSQL avec le PVC pour persister les données
> 3. Créez un Secret pour les credentials de la base de données
> 4. Créez un ConfigMap avec la configuration de l'application
> 5. Déployez une application qui utilise le Secret et le ConfigMap
> 6. Supprimez le Pod PostgreSQL et vérifiez que les données persistent
`;


export const k8sHelm = `# Helm & Packaging

## Qu'est-ce que Helm ?

Helm est le **gestionnaire de paquets** pour Kubernetes. Il permet de :
- **Packager** des applications K8s en charts réutilisables
- **Versionner** les déploiements
- **Paramétrer** les déploiements avec des values
- **Partager** des applications via des repositories

## Installation de Helm

\`\`\`bash
# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# macOS
brew install helm

# Vérifier l'installation
helm version
\`\`\`

## Commandes essentielles

\`\`\`bash
# Ajouter un repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Rechercher un chart
helm search repo nginx
helm search hub wordpress

# Voir les values disponibles
helm show values bitnami/nginx
helm show values bitnami/nginx > values.yaml

# Installer un chart
helm install mon-nginx bitnami/nginx
helm install mon-nginx bitnami/nginx -f custom-values.yaml
helm install mon-nginx bitnami/nginx --set replicaCount=3

# Lister les releases
helm list
helm list -A  # Tous les namespaces

# Voir le statut d'une release
helm status mon-nginx

# Mettre à jour une release
helm upgrade mon-nginx bitnami/nginx -f new-values.yaml
helm upgrade --install mon-nginx bitnami/nginx  # Install si n'existe pas

# Historique et rollback
helm history mon-nginx
helm rollback mon-nginx 1

# Désinstaller
helm uninstall mon-nginx
\`\`\`


## Structure d'un Chart Helm

\`\`\`
mon-chart/
├── Chart.yaml          # Métadonnées du chart
├── values.yaml         # Valeurs par défaut
├── charts/             # Dépendances (sous-charts)
├── templates/          # Templates Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   ├── _helpers.tpl    # Fonctions helper réutilisables
│   ├── NOTES.txt       # Notes affichées après installation
│   └── tests/
│       └── test-connection.yaml
└── .helmignore         # Fichiers à ignorer
\`\`\`

## Créer son propre Chart

### Initialiser un chart
\`\`\`bash
helm create mon-webapp
\`\`\`

### Chart.yaml
\`\`\`yaml
apiVersion: v2
name: mon-webapp
description: Une application web de démonstration
type: application
version: 0.1.0       # Version du chart
appVersion: "1.0.0"  # Version de l'application
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
\`\`\`

### values.yaml
\`\`\`yaml
# Valeurs par défaut
replicaCount: 2

image:
  repository: mon-app
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: app.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: app-tls
      hosts:
        - app.example.com

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

postgresql:
  enabled: true
  auth:
    postgresPassword: changeme
    database: myapp
\`\`\`


### templates/deployment.yaml
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mon-webapp.fullname" . }}
  labels:
    {{- include "mon-webapp.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "mon-webapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mon-webapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
          readinessProbe:
            httpGet:
              path: /ready
              port: http
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
\`\`\`

### templates/_helpers.tpl
\`\`\`
{{/*
Nom complet de l'application
*/}}
{{- define "mon-webapp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Labels communs
*/}}
{{- define "mon-webapp.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "mon-webapp.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "mon-webapp.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
\`\`\`

## Tester et valider un Chart

\`\`\`bash
# Valider la syntaxe
helm lint mon-webapp/

# Générer les templates sans installer (debug)
helm template mon-release mon-webapp/ -f values-prod.yaml

# Dry-run avec le cluster
helm install mon-release mon-webapp/ --dry-run --debug

# Tester une release déployée
helm test mon-release
\`\`\`

## Publier un Chart

\`\`\`bash
# Packager le chart
helm package mon-webapp/

# Générer l'index du repository
helm repo index . --url https://charts.example.com

# Utiliser un registry OCI (Helm 3.8+)
helm push mon-webapp-0.1.0.tgz oci://registry.example.com/charts
\`\`\`


## Comparaison des approches de déploiement

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| **kubectl apply** | Simple, direct | Pas de versioning, pas de templating |
| **Kustomize** | Natif kubectl, overlays | Pas de templating, pas de repos |
| **Helm** | Templating, repos, rollback | Complexité, learning curve |
| **ArgoCD + Helm** | GitOps, audit trail | Infrastructure supplémentaire |

## Bonnes pratiques Helm

- Utiliser des **values** pour tout ce qui change entre environnements
- Définir des **valeurs par défaut** sensées dans values.yaml
- Versionner le chart séparément de l'application
- Utiliser **helm diff** plugin pour prévisualiser les changements
- Stocker les values spécifiques à l'environnement dans un repo Git
- Utiliser des **hooks** pour les migrations de base de données

## Exercice pratique

> **TP** :
> 1. Créez un chart Helm pour une application web (nginx + configmap)
> 2. Définissez des values pour : replicas, image, port, ingress hostname
> 3. Installez le chart avec les values par défaut
> 4. Mettez à jour avec des values personnalisées (5 replicas, nouveau hostname)
> 5. Consultez l'historique et faites un rollback
> 6. Packagez et publiez votre chart
`;
