export const dockerIntro = `# Introduction à Docker

## Qu'est-ce que la conteneurisation ?

La **conteneurisation** est une technologie de virtualisation légère qui permet d'empaqueter une application avec toutes ses dépendances dans une unité standardisée appelée **conteneur**. Contrairement aux machines virtuelles, les conteneurs partagent le noyau du système d'exploitation hôte, ce qui les rend beaucoup plus légers et rapides à démarrer.

## Docker vs Machines Virtuelles

| Caractéristique | Docker (Conteneurs) | Machines Virtuelles |
|---|---|---|
| Démarrage | Quelques secondes | Quelques minutes |
| Taille | Mégaoctets | Gigaoctets |
| Performance | Quasi-native | Overhead de l'hyperviseur |
| Isolation | Niveau processus | Niveau matériel |
| OS | Partage le noyau hôte | OS complet par VM |
| Densité | Des centaines par hôte | Dizaines par hôte |
| Portabilité | Très élevée | Moyenne |

## Architecture de Docker

Docker utilise une architecture **client-serveur** composée de trois éléments principaux :

### 1. Docker Daemon (dockerd)

Le daemon Docker est le processus serveur qui gère les objets Docker (images, conteneurs, réseaux, volumes). Il écoute les requêtes de l'API Docker.

\`\`\`bash
# Vérifier le statut du daemon Docker
sudo systemctl status docker

# Démarrer le daemon
sudo systemctl start docker

# Activer au démarrage
sudo systemctl enable docker
\`\`\`

### 2. Docker CLI (client)

Le client Docker est l'outil en ligne de commande qui permet aux utilisateurs d'interagir avec le daemon via l'API REST.

\`\`\`bash
# Le client envoie des commandes au daemon
docker info
docker version
\`\`\`

### 3. Docker Registry

Un registry est un dépôt d'images Docker. **Docker Hub** est le registry public par défaut.

\`\`\`bash
# Télécharger une image depuis Docker Hub
docker pull nginx:latest

# Pousser une image vers un registry
docker push mon-registry.example.com/mon-image:v1.0
\`\`\`

## Concepts fondamentaux

### Images Docker

Une image est un modèle en lecture seule utilisé pour créer des conteneurs. Elle est composée de couches (layers) empilées les unes sur les autres.

\`\`\`bash
# Lister les images locales
docker images

# Télécharger une image
docker pull ubuntu:22.04

# Supprimer une image
docker rmi ubuntu:22.04
\`\`\`

### Conteneurs

Un conteneur est une instance en cours d'exécution d'une image. Il ajoute une couche inscriptible au-dessus des couches de l'image.

\`\`\`bash
# Créer et démarrer un conteneur
docker run -d --name mon-nginx -p 8080:80 nginx

# Lister les conteneurs en cours d'exécution
docker ps

# Lister tous les conteneurs (y compris arrêtés)
docker ps -a

# Arrêter un conteneur
docker stop mon-nginx

# Supprimer un conteneur
docker rm mon-nginx
\`\`\`

### Dockerfile

Un Dockerfile est un fichier texte contenant les instructions pour construire une image Docker.

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
\`\`\`

### Registry et Repositories

- **Registry** : serveur qui stocke les images (Docker Hub, GitHub Container Registry, etc.)
- **Repository** : collection d'images avec le même nom mais des tags différents
- **Tag** : identifiant de version d'une image (ex: \`nginx:1.25\`, \`nginx:latest\`)

## Le cycle de vie Docker

\`\`\`
Dockerfile → docker build → Image → docker run → Conteneur
                                  → docker push → Registry
\`\`\`

## Exercice pratique

1. Installez Docker sur votre machine (voir leçon suivante)
2. Téléchargez l'image \`hello-world\` et exécutez-la :

\`\`\`bash
docker run hello-world
\`\`\`

3. Téléchargez l'image \`nginx:alpine\` et lancez un conteneur :

\`\`\`bash
docker run -d --name web -p 8080:80 nginx:alpine
\`\`\`

4. Vérifiez que le serveur fonctionne en accédant à \`http://localhost:8080\`
5. Listez les conteneurs actifs, arrêtez et supprimez le conteneur
6. Comparez la taille des images \`nginx\` et \`nginx:alpine\` avec \`docker images\`
`;


export const dockerInstallation = `# Installation de Docker

## Installation sur RHEL / CentOS / Rocky Linux

### Prérequis

\`\`\`bash
# Supprimer les anciennes versions
sudo dnf remove docker docker-client docker-client-latest \\
    docker-common docker-latest docker-latest-logrotate \\
    docker-logrotate docker-engine

# Installer les dépendances
sudo dnf install -y dnf-utils
\`\`\`

### Installation depuis le dépôt officiel

\`\`\`bash
# Ajouter le dépôt Docker
sudo dnf config-manager --add-repo \\
    https://download.docker.com/linux/rhel/docker-ce.repo

# Installer Docker Engine
sudo dnf install -y docker-ce docker-ce-cli containerd.io \\
    docker-buildx-plugin docker-compose-plugin

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier l'installation
sudo docker run hello-world
\`\`\`

### Ajouter votre utilisateur au groupe docker

\`\`\`bash
# Éviter d'utiliser sudo à chaque commande
sudo usermod -aG docker $USER

# Appliquer le changement (ou se reconnecter)
newgrp docker
\`\`\`

## Installation sur Ubuntu / Debian

\`\`\`bash
# Supprimer les anciennes versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Installer les prérequis
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Ajouter la clé GPG officielle de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Ajouter le dépôt
echo "deb [arch=$(dpkg --print-architecture) \\
    signed-by=/etc/apt/keyrings/docker.gpg] \\
    https://download.docker.com/linux/ubuntu \\
    $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \\
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \\
    docker-buildx-plugin docker-compose-plugin

# Vérifier l'installation
sudo docker run hello-world
\`\`\`

## Docker vs Podman

| Caractéristique | Docker | Podman |
|---|---|---|
| Daemon | Oui (dockerd) | Non (daemonless) |
| Root requis | Par défaut oui | Non (rootless natif) |
| Compatibilité CLI | Référence | Compatible Docker |
| Compose | docker compose | podman-compose |
| Pods | Non | Oui (comme Kubernetes) |
| Systemd | Intégration limitée | Intégration native |
| Sécurité | Daemon root | Pas de daemon root |

### Utiliser Podman comme alternative

\`\`\`bash
# Installation sur RHEL/Fedora
sudo dnf install -y podman

# Installation sur Ubuntu
sudo apt-get install -y podman

# Utilisation identique à Docker
podman run hello-world
podman ps
podman images

# Alias pour compatibilité
alias docker=podman
\`\`\`

## Premières commandes Docker

### docker run - Exécuter un conteneur

\`\`\`bash
# Exécuter un conteneur interactif
docker run -it ubuntu:22.04 bash

# Exécuter en arrière-plan (détaché)
docker run -d --name mon-serveur nginx

# Avec mapping de ports
docker run -d -p 8080:80 nginx

# Avec variables d'environnement
docker run -d -e MYSQL_ROOT_PASSWORD=secret mysql:8.0

# Avec un volume
docker run -d -v /mes-donnees:/data alpine
\`\`\`

### docker pull - Télécharger une image

\`\`\`bash
# Télécharger la dernière version
docker pull nginx

# Télécharger une version spécifique
docker pull node:20-alpine

# Depuis un registry privé
docker pull registry.example.com/mon-app:v2.0
\`\`\`

### docker ps - Lister les conteneurs

\`\`\`bash
# Conteneurs en cours d'exécution
docker ps

# Tous les conteneurs
docker ps -a

# Afficher uniquement les IDs
docker ps -q

# Avec formatage personnalisé
docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
\`\`\`

### docker images - Gérer les images

\`\`\`bash
# Lister toutes les images
docker images

# Filtrer par nom
docker images nginx

# Afficher les images pendantes (dangling)
docker images -f dangling=true

# Supprimer les images inutilisées
docker image prune -a
\`\`\`

## Alternatives à Docker Desktop

Docker Desktop est payant pour les entreprises de plus de 250 employés. Voici des alternatives :

| Alternative | Plateforme | Description |
|---|---|---|
| Rancher Desktop | Windows/Mac/Linux | GUI avec containerd ou dockerd |
| Colima | macOS/Linux | Docker léger pour macOS |
| Podman Desktop | Windows/Mac/Linux | Interface graphique pour Podman |
| Lima | macOS/Linux | VMs Linux pour conteneurs |
| Minikube | Tous | Avec le driver Docker |

### Installation de Colima (macOS)

\`\`\`bash
# Installation via Homebrew
brew install colima docker

# Démarrer Colima
colima start

# Vérifier
docker ps
\`\`\`

### Installation de Rancher Desktop

\`\`\`bash
# Sur Linux (AppImage)
wget https://github.com/rancher-sandbox/rancher-desktop/releases/latest/download/rancher-desktop-linux-x86_64.AppImage
chmod +x rancher-desktop-linux-x86_64.AppImage
./rancher-desktop-linux-x86_64.AppImage
\`\`\`

## Configuration post-installation

### Configurer le logging

\`\`\`bash
# /etc/docker/daemon.json
sudo tee /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker
\`\`\`

## Exercice pratique

1. Installez Docker sur votre distribution Linux
2. Vérifiez l'installation avec \`docker version\` et \`docker info\`
3. Exécutez les commandes suivantes et observez les résultats :

\`\`\`bash
docker run hello-world
docker run -it alpine sh
docker run -d -p 8080:80 --name web nginx
docker ps
docker logs web
docker exec -it web sh
docker stop web
docker rm web
\`\`\`

4. (Optionnel) Installez Podman et exécutez les mêmes commandes
5. Configurez le logging Docker avec une rotation des fichiers
`;


export const dockerImages = `# Images Docker et Dockerfile

## Anatomie d'un Dockerfile

Un Dockerfile est un fichier texte qui contient toutes les instructions nécessaires pour construire une image Docker. Chaque instruction crée une nouvelle couche (layer) dans l'image.

## Instructions principales

### FROM - Image de base

\`\`\`dockerfile
# Image officielle avec tag spécifique
FROM python:3.11-slim

# Image minimale
FROM alpine:3.19

# Image scratch (vide) pour binaires statiques
FROM scratch
\`\`\`

### RUN - Exécuter des commandes

\`\`\`dockerfile
# Forme shell
RUN apt-get update && apt-get install -y curl

# Forme exec (recommandée)
RUN ["apt-get", "install", "-y", "nginx"]

# Bonnes pratiques : combiner les commandes pour réduire les couches
RUN apt-get update && \\
    apt-get install -y --no-install-recommends \\
        curl \\
        wget \\
        git && \\
    rm -rf /var/lib/apt/lists/*
\`\`\`

### COPY et ADD - Copier des fichiers

\`\`\`dockerfile
# Copier un fichier
COPY package.json /app/

# Copier un répertoire
COPY src/ /app/src/

# COPY avec changement de propriétaire
COPY --chown=node:node . /app/

# ADD peut extraire des archives et télécharger des URLs
ADD archive.tar.gz /app/
\`\`\`

### ENV - Variables d'environnement

\`\`\`dockerfile
# Définir une variable
ENV NODE_ENV=production

# Plusieurs variables
ENV APP_HOME=/app \\
    APP_PORT=3000
\`\`\`

### EXPOSE - Déclarer les ports

\`\`\`dockerfile
# Documenter le port exposé (informatif uniquement)
EXPOSE 8080
EXPOSE 443/tcp
EXPOSE 53/udp
\`\`\`

### WORKDIR - Répertoire de travail

\`\`\`dockerfile
# Définir le répertoire de travail
WORKDIR /app

# Les commandes suivantes s'exécutent dans /app
RUN npm install
COPY . .
\`\`\`

### CMD vs ENTRYPOINT

\`\`\`dockerfile
# CMD - commande par défaut (peut être remplacée)
CMD ["node", "server.js"]

# ENTRYPOINT - point d'entrée fixe
ENTRYPOINT ["python"]
CMD ["app.py"]
# Résultat : python app.py
# docker run mon-image script.py → python script.py
\`\`\`

| Instruction | Rôle | Remplaçable au runtime |
|---|---|---|
| CMD | Commande par défaut | Oui, avec docker run <args> |
| ENTRYPOINT | Point d'entrée fixe | Avec --entrypoint seulement |
| Les deux combinés | ENTRYPOINT = exécutable, CMD = arguments par défaut | CMD remplaçable |

## Exemple complet : Application Node.js

\`\`\`dockerfile
# Étape 1 : Image de base
FROM node:20-alpine

# Étape 2 : Métadonnées
LABEL maintainer="devops@example.com"
LABEL version="1.0"

# Étape 3 : Répertoire de travail
WORKDIR /app

# Étape 4 : Installer les dépendances (cache optimal)
COPY package*.json ./
RUN npm ci --only=production

# Étape 5 : Copier le code source
COPY . .

# Étape 6 : Configuration
ENV NODE_ENV=production
EXPOSE 3000

# Étape 7 : Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Étape 8 : Commande de démarrage
CMD ["node", "server.js"]
\`\`\`

### Construire et exécuter

\`\`\`bash
# Construire l'image
docker build -t mon-app:v1.0 .

# Construire avec un Dockerfile spécifique
docker build -f Dockerfile.prod -t mon-app:prod .

# Exécuter
docker run -d -p 3000:3000 mon-app:v1.0
\`\`\`

## Builds multi-étapes (Multi-stage builds)

Les builds multi-étapes permettent de réduire considérablement la taille des images finales en séparant la compilation du runtime.

### Exemple : Application Go

\`\`\`dockerfile
# Étape de compilation
FROM golang:1.22-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# Étape finale (image minimale)
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
\`\`\`

### Exemple : Application React

\`\`\`dockerfile
# Étape de build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape de production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### Comparaison des tailles

| Approche | Taille approximative |
|---|---|
| Node.js sans multi-stage | ~900 MB |
| Node.js avec multi-stage | ~150 MB |
| Go sans multi-stage | ~800 MB |
| Go avec multi-stage (alpine) | ~15 MB |
| Go avec multi-stage (scratch) | ~8 MB |

## Le fichier .dockerignore

Le fichier \`.dockerignore\` exclut des fichiers du contexte de build, similaire à \`.gitignore\`.

\`\`\`text
# Dépendances
node_modules/
vendor/

# Fichiers de build
dist/
build/
*.o
*.a

# Fichiers de configuration locale
.env
.env.local
docker-compose.override.yml

# Fichiers Git
.git
.gitignore

# Documentation
README.md
docs/

# Fichiers IDE
.vscode/
.idea/
*.swp

# Fichiers OS
.DS_Store
Thumbs.db

# Tests
__tests__/
coverage/
*.test.js
\`\`\`

## Bonnes pratiques pour réduire la taille des images

### 1. Choisir une image de base légère

\`\`\`dockerfile
# Mauvais : image complète (~900 MB)
FROM node:20

# Mieux : variante slim (~200 MB)
FROM node:20-slim

# Optimal : variante alpine (~50 MB)
FROM node:20-alpine
\`\`\`

### 2. Minimiser le nombre de couches

\`\`\`dockerfile
# Mauvais : 3 couches séparées
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# Bon : 1 seule couche
RUN apt-get update && \\
    apt-get install -y --no-install-recommends curl && \\
    rm -rf /var/lib/apt/lists/*
\`\`\`

### 3. Exploiter le cache de build

\`\`\`dockerfile
# Bon : les dépendances changent moins souvent que le code
COPY package*.json ./
RUN npm ci
COPY . .
\`\`\`

### 4. Nettoyer dans la même instruction RUN

\`\`\`dockerfile
RUN apt-get update && \\
    apt-get install -y build-essential && \\
    make && make install && \\
    apt-get purge -y build-essential && \\
    apt-get autoremove -y && \\
    rm -rf /var/lib/apt/lists/*
\`\`\`

### 5. Utiliser des arguments de build

\`\`\`dockerfile
ARG APP_VERSION=latest
FROM myapp:$APP_VERSION

ARG BUILD_DATE
LABEL build-date=$BUILD_DATE
\`\`\`

\`\`\`bash
docker build --build-arg APP_VERSION=2.0 --build-arg BUILD_DATE=$(date -I) -t myapp .
\`\`\`

## Exercice pratique

1. Créez un Dockerfile pour une application Python Flask :

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
\`\`\`

2. Optimisez-le avec un build multi-étapes
3. Créez un fichier \`.dockerignore\` approprié
4. Comparez la taille de l'image avec et sans optimisations :

\`\`\`bash
docker build -t flask-app:v1 -f Dockerfile.basic .
docker build -t flask-app:v2 -f Dockerfile.optimized .
docker images | grep flask-app
\`\`\`

5. Analysez les couches de votre image :

\`\`\`bash
docker history flask-app:v2
\`\`\`
`;


export const dockerCompose = `# Docker Compose

## Introduction

**Docker Compose** est un outil permettant de définir et gérer des applications multi-conteneurs. Au lieu de lancer chaque conteneur individuellement, vous décrivez l'ensemble de votre stack dans un fichier YAML.

## Structure du fichier docker-compose.yml

\`\`\`yaml
# Version de la spécification (optionnel avec Compose V2)
version: "3.9"

services:
  # Définition des services (conteneurs)
  web:
    image: nginx:alpine
    ports:
      - "8080:80"

  api:
    build: ./api
    ports:
      - "3000:3000"

networks:
  # Réseaux personnalisés
  frontend:
  backend:

volumes:
  # Volumes nommés
  db-data:
  cache-data:
\`\`\`

## Services

### Configuration d'un service

\`\`\`yaml
services:
  api:
    # Image depuis un registry
    image: node:20-alpine

    # Ou build depuis un Dockerfile
    build:
      context: ./api
      dockerfile: Dockerfile.prod
      args:
        NODE_ENV: production

    # Nom du conteneur
    container_name: mon-api

    # Commande à exécuter
    command: npm start

    # Ports exposés
    ports:
      - "3000:3000"
      - "9229:9229"  # debug

    # Variables d'environnement
    environment:
      - NODE_ENV=production
      - DB_HOST=database

    # Ou depuis un fichier
    env_file:
      - .env
      - .env.production

    # Volumes
    volumes:
      - ./src:/app/src
      - node_modules:/app/node_modules

    # Réseaux
    networks:
      - backend
      - frontend

    # Redémarrage automatique
    restart: unless-stopped
\`\`\`

## Réseaux (Networks)

\`\`\`yaml
services:
  frontend:
    image: react-app
    networks:
      - front-net

  api:
    image: express-api
    networks:
      - front-net
      - back-net

  database:
    image: postgres:16
    networks:
      - back-net

networks:
  front-net:
    driver: bridge
  back-net:
    driver: bridge
    internal: true  # Pas d'accès à Internet
\`\`\`

## Volumes

\`\`\`yaml
services:
  database:
    image: postgres:16
    volumes:
      # Volume nommé (persistant)
      - db-data:/var/lib/postgresql/data
      # Bind mount (développement)
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  db-data:
    driver: local
\`\`\`

## Application multi-conteneurs complète

\`\`\`yaml
version: "3.9"

services:
  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    depends_on:
      - api
    networks:
      - frontend-net

  # API Node.js
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - frontend-net
      - backend-net

  # Base de données PostgreSQL
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/01-init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend-net

  # Cache Redis
  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - backend-net

  # Adminer (interface DB)
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:

volumes:
  postgres-data:
  redis-data:
\`\`\`

## Variables d'environnement

### Fichier .env

\`\`\`bash
# .env
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
POSTGRES_DB=production
APP_PORT=4000
\`\`\`

### Utilisation dans docker-compose.yml

\`\`\`yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "\${DB_PORT:-5432}:5432"  # Valeur par défaut
\`\`\`

## depends_on et ordre de démarrage

\`\`\`yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
      migrations:
        condition: service_completed_successfully

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

  migrations:
    build: ./api
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
\`\`\`

## Health Checks

\`\`\`yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
\`\`\`

## Commandes Docker Compose

\`\`\`bash
# Démarrer tous les services
docker compose up -d

# Démarrer un service spécifique
docker compose up -d api

# Voir les logs
docker compose logs -f api

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Reconstruire les images
docker compose build
docker compose up -d --build

# Voir le statut des services
docker compose ps

# Exécuter une commande dans un service
docker compose exec api sh
docker compose exec db psql -U user -d myapp

# Mettre à l'échelle un service
docker compose up -d --scale api=3
\`\`\`

## Profils et surcharges

### docker-compose.override.yml (développement)

\`\`\`yaml
# docker-compose.override.yml - Automatiquement chargé
services:
  api:
    volumes:
      - ./api/src:/app/src  # Hot reload
    environment:
      - DEBUG=true
    command: npm run dev

  frontend:
    volumes:
      - ./frontend/src:/app/src
    command: npm run dev
\`\`\`

### Fichier de production séparé

\`\`\`bash
# Utiliser un fichier spécifique
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

## Exercice pratique

1. Créez une application complète avec Docker Compose comprenant :
   - Un frontend (nginx servant des fichiers statiques)
   - Une API (Node.js ou Python)
   - Une base de données (PostgreSQL)
   - Un cache (Redis)

2. Configurez :
   - Les health checks pour la base de données
   - Les depends_on avec conditions
   - Les variables d'environnement via un fichier .env
   - Un réseau séparé pour le backend

3. Testez les commandes :

\`\`\`bash
docker compose up -d
docker compose ps
docker compose logs -f api
docker compose exec db psql -U user -d myapp
docker compose down -v
\`\`\`
`;


export const dockerNetworking = `# Réseau Docker et Volumes

## Les types de réseaux Docker

Docker propose plusieurs drivers de réseau pour différents cas d'utilisation :

| Driver | Description | Cas d'utilisation |
|---|---|---|
| bridge | Réseau par défaut, isolé de l'hôte | Conteneurs sur un seul hôte |
| host | Partage le réseau de l'hôte | Performance maximale |
| overlay | Réseau multi-hôte | Docker Swarm / clusters |
| macvlan | Adresse MAC dédiée | Intégration réseau physique |
| none | Pas de réseau | Isolation complète |

## Réseau Bridge

Le réseau bridge est le mode par défaut. Les conteneurs sur le même bridge peuvent communiquer entre eux.

### Bridge par défaut

\`\`\`bash
# Les conteneurs sur le bridge par défaut communiquent par IP uniquement
docker run -d --name web nginx
docker run -d --name app node:20-alpine

# Inspecter le réseau
docker network inspect bridge
\`\`\`

### Bridge personnalisé (recommandé)

\`\`\`bash
# Créer un réseau personnalisé
docker network create mon-reseau

# Les conteneurs peuvent communiquer par nom
docker run -d --name api --network mon-reseau node:20-alpine
docker run -d --name db --network mon-reseau postgres:16

# Depuis le conteneur api, on peut atteindre db par son nom
docker exec api ping db
\`\`\`

### Avantages du bridge personnalisé vs défaut

| Fonctionnalité | Bridge par défaut | Bridge personnalisé |
|---|---|---|
| Résolution DNS par nom | Non | Oui |
| Isolation | Tous les conteneurs | Seulement les membres |
| Connexion à chaud | Non | Oui (connect/disconnect) |
| Configuration | Limitée | Complète |

## Réseau Host

Le conteneur utilise directement la pile réseau de l'hôte, sans isolation.

\`\`\`bash
# Le conteneur écoute directement sur le port 80 de l'hôte
docker run -d --network host nginx

# Pas besoin de -p pour le mapping de ports
# Attention : pas d'isolation réseau !
\`\`\`

## Réseau Overlay

Pour la communication entre conteneurs sur différents hôtes (Docker Swarm).

\`\`\`bash
# Créer un réseau overlay (nécessite Swarm)
docker network create --driver overlay --attachable mon-overlay

# Les services Swarm utilisent ce réseau
docker service create --name api --network mon-overlay mon-api:v1
\`\`\`

## Mapping de ports

\`\`\`bash
# Syntaxe : -p <hôte>:<conteneur>
docker run -d -p 8080:80 nginx

# Mapper sur une interface spécifique
docker run -d -p 127.0.0.1:8080:80 nginx

# Mapper un port aléatoire
docker run -d -p 80 nginx
docker port <container_id>

# Mapper plusieurs ports
docker run -d -p 80:80 -p 443:443 nginx

# Protocole UDP
docker run -d -p 53:53/udp dns-server
\`\`\`

## Commandes réseau utiles

\`\`\`bash
# Lister les réseaux
docker network ls

# Créer un réseau
docker network create --driver bridge --subnet 172.20.0.0/16 mon-reseau

# Connecter un conteneur à un réseau
docker network connect mon-reseau mon-conteneur

# Déconnecter un conteneur
docker network disconnect mon-reseau mon-conteneur

# Inspecter un réseau
docker network inspect mon-reseau

# Supprimer les réseaux inutilisés
docker network prune
\`\`\`

---

## Les Volumes Docker

Les volumes sont le mécanisme recommandé pour persister les données générées et utilisées par les conteneurs.

## Types de stockage

| Type | Description | Cas d'utilisation |
|---|---|---|
| Volume nommé | Géré par Docker, stocké dans /var/lib/docker/volumes | Données de production |
| Bind mount | Chemin du système hôte monté dans le conteneur | Développement, config |
| tmpfs | Stocké en mémoire uniquement | Données temporaires sensibles |

## Volumes nommés

\`\`\`bash
# Créer un volume
docker volume create mes-donnees

# Utiliser un volume nommé
docker run -d \\
    --name db \\
    -v mes-donnees:/var/lib/postgresql/data \\
    postgres:16

# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect mes-donnees

# Supprimer un volume
docker volume rm mes-donnees

# Supprimer les volumes orphelins
docker volume prune
\`\`\`

### Avantages des volumes nommés

- Gérés par Docker (indépendants du système de fichiers hôte)
- Peuvent être sauvegardés et migrés
- Fonctionnent sur Linux et macOS/Windows
- Peuvent être partagés entre conteneurs
- Les drivers de volume permettent le stockage distant (NFS, cloud)

## Bind Mounts

\`\`\`bash
# Monter un répertoire local
docker run -d \\
    --name dev-api \\
    -v $(pwd)/src:/app/src \\
    -v $(pwd)/config:/app/config:ro \\
    node:20-alpine npm run dev

# Syntaxe moderne avec --mount
docker run -d \\
    --name dev-api \\
    --mount type=bind,source=$(pwd)/src,target=/app/src \\
    --mount type=bind,source=$(pwd)/config,target=/app/config,readonly \\
    node:20-alpine npm run dev
\`\`\`

### Options de montage

\`\`\`bash
# Lecture seule
-v /host/path:/container/path:ro

# Avec propagation
-v /host/path:/container/path:rshared

# SELinux (RHEL/Fedora)
-v /host/path:/container/path:Z    # Privé
-v /host/path:/container/path:z    # Partagé
\`\`\`

## tmpfs Mounts

\`\`\`bash
# Monter un tmpfs (stockage en RAM)
docker run -d \\
    --name secure-app \\
    --tmpfs /app/tmp:rw,size=100m,mode=1777 \\
    mon-app

# Syntaxe --mount
docker run -d \\
    --mount type=tmpfs,destination=/app/secrets,tmpfs-size=50m \\
    mon-app
\`\`\`

## Stratégies de persistance des données

### Base de données

\`\`\`yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      # Données persistantes
      - postgres-data:/var/lib/postgresql/data
      # Scripts d'initialisation
      - ./db/init:/docker-entrypoint-initdb.d:ro
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  postgres-data:
\`\`\`

### Sauvegarde de volumes

\`\`\`bash
# Sauvegarder un volume dans une archive
docker run --rm \\
    -v mes-donnees:/source:ro \\
    -v $(pwd):/backup \\
    alpine tar czf /backup/sauvegarde.tar.gz -C /source .

# Restaurer une sauvegarde
docker run --rm \\
    -v mes-donnees:/target \\
    -v $(pwd):/backup:ro \\
    alpine tar xzf /backup/sauvegarde.tar.gz -C /target
\`\`\`

### Partager des données entre conteneurs

\`\`\`yaml
services:
  app:
    image: mon-app
    volumes:
      - shared-data:/app/uploads

  nginx:
    image: nginx:alpine
    volumes:
      - shared-data:/usr/share/nginx/html/uploads:ro

volumes:
  shared-data:
\`\`\`

## Patterns courants en développement

### Hot reload avec bind mounts

\`\`\`yaml
services:
  api:
    build: ./api
    volumes:
      - ./api/src:/app/src          # Code source (hot reload)
      - /app/node_modules           # Volume anonyme (ne pas écraser)
    command: npm run dev
\`\`\`

### Fichiers de configuration

\`\`\`yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certs:/etc/nginx/certs:ro
\`\`\`

## Exercice pratique

1. Créez un réseau bridge personnalisé et lancez deux conteneurs dessus :

\`\`\`bash
docker network create app-network
docker run -d --name api --network app-network nginx
docker run -d --name client --network app-network alpine sleep 3600
docker exec client wget -qO- http://api
\`\`\`

2. Configurez une base de données PostgreSQL avec un volume persistant :

\`\`\`bash
docker volume create pg-data
docker run -d --name db -v pg-data:/var/lib/postgresql/data \\
    -e POSTGRES_PASSWORD=secret postgres:16
\`\`\`

3. Sauvegardez et restaurez le volume
4. Créez un docker-compose.yml avec des réseaux séparés frontend/backend
5. Testez l'isolation : vérifiez que le frontend ne peut pas accéder directement à la base de données
`;


export const dockerSecurity = `# Sécurité Docker et Production

## Exécution en tant qu'utilisateur non-root

Par défaut, les conteneurs s'exécutent en tant que root. C'est un risque de sécurité majeur.

### Dans le Dockerfile

\`\`\`dockerfile
FROM node:20-alpine

# Créer un utilisateur dédié
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Changer la propriété des fichiers
WORKDIR /app
COPY --chown=appuser:appgroup . .
RUN npm ci --only=production

# Basculer vers l'utilisateur non-root
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### Au runtime

\`\`\`bash
# Forcer l'exécution en tant qu'utilisateur spécifique
docker run -d --user 1000:1000 mon-app

# Vérifier l'utilisateur dans un conteneur
docker exec mon-app whoami
docker exec mon-app id
\`\`\`

### Bonnes pratiques utilisateur

| Pratique | Description |
|---|---|
| USER dans Dockerfile | Définir un utilisateur non-root |
| --user au runtime | Forcer un UID/GID spécifique |
| chown les fichiers | S'assurer que l'utilisateur a les droits nécessaires |
| Pas de sudo | Ne pas installer sudo dans l'image |
| UID > 1000 | Éviter les UIDs système |

## Conteneurs en lecture seule

\`\`\`bash
# Système de fichiers en lecture seule
docker run -d \\
    --read-only \\
    --tmpfs /tmp \\
    --tmpfs /var/run \\
    mon-app

# Docker Compose
\`\`\`

\`\`\`yaml
services:
  api:
    image: mon-api
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
    volumes:
      - logs:/app/logs  # Seul répertoire inscriptible
\`\`\`

## Limites de ressources

### CPU et mémoire

\`\`\`bash
# Limiter la mémoire à 512 MB
docker run -d --memory=512m mon-app

# Limiter le CPU à 1.5 cœurs
docker run -d --cpus=1.5 mon-app

# Combiné
docker run -d \\
    --memory=512m \\
    --memory-swap=1g \\
    --cpus=2 \\
    --pids-limit=100 \\
    mon-app
\`\`\`

### Docker Compose

\`\`\`yaml
services:
  api:
    image: mon-api
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 128M
\`\`\`

### Limiter les capabilities Linux

\`\`\`bash
# Supprimer toutes les capabilities et ajouter uniquement celles nécessaires
docker run -d \\
    --cap-drop=ALL \\
    --cap-add=NET_BIND_SERVICE \\
    mon-app

# Empêcher l'escalade de privilèges
docker run -d --security-opt=no-new-privileges mon-app
\`\`\`

## Scan de vulnérabilités des images

### Docker Scout

\`\`\`bash
# Analyser une image locale
docker scout cves mon-image:latest

# Analyse rapide
docker scout quickview mon-image:latest

# Recommandations
docker scout recommendations mon-image:latest
\`\`\`

### Trivy (outil open source)

\`\`\`bash
# Installation
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

# Scanner une image
trivy image mon-image:latest

# Scanner avec seuil de sévérité
trivy image --severity HIGH,CRITICAL mon-image:latest

# Scanner un Dockerfile
trivy config Dockerfile

# Format JSON pour CI/CD
trivy image --format json --output results.json mon-image:latest
\`\`\`

### Grype (alternative)

\`\`\`bash
# Installation
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh

# Scanner une image
grype mon-image:latest

# Échouer si vulnérabilités critiques
grype mon-image:latest --fail-on critical
\`\`\`

### Comparaison des outils de scan

| Outil | Type | Intégration CI | Format sortie |
|---|---|---|---|
| Docker Scout | Commercial | Docker Hub | JSON, SARIF |
| Trivy | Open source | GitHub Actions, GitLab | JSON, Table, SARIF |
| Grype | Open source | GitHub Actions | JSON, Table |
| Snyk | Commercial | Multiple | JSON, HTML |
| Clair | Open source | Quay.io | JSON |

## Docker dans le CI/CD

### GitHub Actions

\`\`\`yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/\${{ github.repository }}:latest
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Scan for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
\`\`\`

### GitLab CI

\`\`\`yaml
stages:
  - build
  - scan
  - deploy

variables:
  IMAGE_TAG: \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA

build:
  stage: build
  image: docker:24-dind
  services:
    - docker:24-dind
  script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
    - docker build -t \$IMAGE_TAG .
    - docker push \$IMAGE_TAG

scan:
  stage: scan
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --exit-code 1 --severity CRITICAL \$IMAGE_TAG

deploy:
  stage: deploy
  script:
    - docker pull \$IMAGE_TAG
    - docker tag \$IMAGE_TAG \$CI_REGISTRY_IMAGE:latest
    - docker push \$CI_REGISTRY_IMAGE:latest
  only:
    - main
\`\`\`

## Registres de conteneurs (Container Registries)

### Types de registres

| Registre | Type | Description |
|---|---|---|
| Docker Hub | Public/Privé | Registre par défaut |
| GitHub Container Registry (ghcr.io) | Public/Privé | Intégré à GitHub |
| GitLab Container Registry | Privé | Intégré à GitLab |
| Amazon ECR | Privé | AWS |
| Google Artifact Registry | Privé | GCP |
| Azure Container Registry | Privé | Azure |
| Harbor | Self-hosted | Open source, entreprise |

### Utilisation d'un registre privé

\`\`\`bash
# Se connecter
docker login ghcr.io -u USERNAME

# Taguer l'image
docker tag mon-app:latest ghcr.io/mon-org/mon-app:v1.0

# Pousser l'image
docker push ghcr.io/mon-org/mon-app:v1.0

# Télécharger l'image
docker pull ghcr.io/mon-org/mon-app:v1.0
\`\`\`

### Registre privé auto-hébergé

\`\`\`yaml
# docker-compose.yml pour un registre privé
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    volumes:
      - registry-data:/var/lib/registry
    environment:
      REGISTRY_STORAGE_DELETE_ENABLED: "true"

volumes:
  registry-data:
\`\`\`

## Bonnes pratiques de sécurité en production

### Checklist de sécurité

\`\`\`dockerfile
# 1. Image de base minimale et à jour
FROM node:20-alpine

# 2. Pas de secrets dans l'image
# Utiliser des secrets Docker ou des variables d'environnement au runtime

# 3. Utilisateur non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# 4. Fichiers en lecture seule quand possible
# --read-only au runtime

# 5. Métadonnées
LABEL org.opencontainers.image.source="https://github.com/org/repo"
LABEL org.opencontainers.image.version="1.0.0"
\`\`\`

### Docker Compose sécurisé

\`\`\`yaml
services:
  api:
    image: mon-api:latest
    read_only: true
    user: "1000:1000"
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: "1.0"
    tmpfs:
      - /tmp:size=50M
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
\`\`\`

### Gestion des secrets

\`\`\`bash
# Docker Secrets (Swarm mode)
echo "mon-mot-de-passe" | docker secret create db_password -

# Utilisation dans un service
docker service create \\
    --name api \\
    --secret db_password \\
    mon-api
\`\`\`

\`\`\`yaml
# Docker Compose avec secrets
services:
  api:
    image: mon-api
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
\`\`\`

## Exercice pratique

1. Prenez un Dockerfile existant et appliquez les bonnes pratiques de sécurité :
   - Utilisateur non-root
   - Image minimale (alpine)
   - Suppression des capabilities inutiles
   - Système de fichiers en lecture seule

2. Scannez une image avec Trivy :

\`\`\`bash
trivy image nginx:latest
trivy image nginx:alpine
# Comparez le nombre de vulnérabilités
\`\`\`

3. Créez un pipeline CI/CD (GitHub Actions ou GitLab CI) qui :
   - Construit l'image
   - Scanne les vulnérabilités
   - Pousse vers un registre si pas de vulnérabilité critique

4. Configurez un docker-compose.yml de production avec toutes les mesures de sécurité :
   - Limites de ressources
   - Conteneurs en lecture seule
   - Utilisateurs non-root
   - Health checks
   - Secrets
`;
