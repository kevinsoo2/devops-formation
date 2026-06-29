export const cicdIntro = `# Introduction au CI/CD

## Qu'est-ce que le CI/CD ?

Le **CI/CD** (Intégration Continue / Livraison Continue / Déploiement Continu) est un ensemble de pratiques DevOps qui permettent d'automatiser le cycle de vie du développement logiciel.

## Les trois piliers

### CI - Intégration Continue (Continuous Integration)

L'intégration continue consiste à fusionner fréquemment les modifications de code dans un dépôt partagé, avec des tests automatisés à chaque intégration.

**Objectifs :**
- Détecter les erreurs rapidement
- Réduire les conflits de merge
- Garantir la qualité du code en permanence

### CD - Livraison Continue (Continuous Delivery)

La livraison continue étend la CI en automatisant la préparation des releases pour le déploiement en production.

**Objectifs :**
- Code toujours prêt à être déployé
- Réduction du temps entre le développement et la mise en production
- Déploiements fiables et reproductibles

### CD - Déploiement Continu (Continuous Deployment)

Le déploiement continu va encore plus loin : chaque modification validée est automatiquement déployée en production.

**Objectifs :**
- Livraison instantanée de valeur aux utilisateurs
- Feedback rapide
- Itérations plus courtes

## Comparaison des approches

| Aspect | CI | Livraison Continue | Déploiement Continu |
|--------|----|--------------------|---------------------|
| Tests automatisés | ✅ | ✅ | ✅ |
| Build automatisé | ✅ | ✅ | ✅ |
| Déploiement staging | ❌ | ✅ | ✅ |
| Déploiement production | ❌ | Manuel | ✅ Automatique |
| Validation humaine | ❌ | ✅ Avant prod | ❌ |

## Avantages du CI/CD

1. **Détection précoce des bugs** : Les erreurs sont identifiées dès l'intégration
2. **Livraison rapide** : Réduction du time-to-market
3. **Qualité améliorée** : Tests systématiques à chaque changement
4. **Collaboration facilitée** : Les équipes travaillent sur une base de code stable
5. **Réduction des risques** : Petits changements fréquents vs gros déploiements risqués

## Vue d'ensemble des outils

### GitHub Actions
- Intégré directement dans GitHub
- Configuration en YAML
- Large marketplace d'actions réutilisables
- Gratuit pour les dépôts publics

### GitLab CI/CD
- Intégré dans GitLab
- Fichier \`.gitlab-ci.yml\`
- Runners auto-hébergés ou partagés
- Pipeline as Code natif

### Jenkins
- Open source, auto-hébergé
- Écosystème de plugins très riche
- Jenkinsfile pour Pipeline as Code
- Grande flexibilité de configuration

### Comparaison des outils

| Critère | GitHub Actions | GitLab CI | Jenkins |
|---------|---------------|-----------|---------|
| Hébergement | Cloud | Cloud/Self | Self-hosted |
| Configuration | YAML | YAML | Groovy/YAML |
| Courbe d'apprentissage | Facile | Moyenne | Difficile |
| Extensibilité | Marketplace | Templates | Plugins |
| Coût | Freemium | Freemium | Gratuit (infra) |

## Pipeline CI/CD typique

\`\`\`yaml
# Exemple de pipeline générique
stages:
  - build
  - test
  - security
  - staging
  - production

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run test
    - npm run lint

security:
  stage: security
  script:
    - npm audit
    - snyk test

deploy-staging:
  stage: staging
  script:
    - deploy --env staging

deploy-production:
  stage: production
  script:
    - deploy --env production
  when: manual
\`\`\`

## Exercices

1. **Exercice 1** : Identifiez les étapes CI et CD dans le pipeline ci-dessus
2. **Exercice 2** : Pour un projet web, listez les tests que vous intégreriez dans votre pipeline CI
3. **Exercice 3** : Comparez les avantages et inconvénients de GitHub Actions vs Jenkins pour une startup vs une grande entreprise
`;


export const cicdGithubActions = `# GitHub Actions

## Présentation

**GitHub Actions** est la plateforme d'automatisation CI/CD intégrée directement dans GitHub. Elle permet de créer des workflows automatisés déclenchés par des événements sur votre dépôt.

## Concepts fondamentaux

- **Workflow** : Un processus automatisé configurable (fichier YAML)
- **Event** : Un déclencheur qui lance le workflow
- **Job** : Un ensemble d'étapes exécutées sur un même runner
- **Step** : Une tâche individuelle (commande ou action)
- **Action** : Une application réutilisable pour une tâche courante
- **Runner** : La machine qui exécute les jobs

## Structure d'un workflow

Les workflows sont définis dans \`.github/workflows/\` :

\`\`\`yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Tous les lundis à 2h

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-\${{ matrix.node-version }}
          path: coverage/

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
\`\`\`

## Déclencheurs (Triggers)

\`\`\`yaml
on:
  # Push sur des branches spécifiques
  push:
    branches: [main, 'release/**']
    paths:
      - 'src/**'
      - 'package.json'
    tags:
      - 'v*'

  # Pull requests
  pull_request:
    types: [opened, synchronize, reopened]

  # Déclenchement manuel
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environnement cible'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

  # Planification cron
  schedule:
    - cron: '30 5 * * 1-5'  # Jours ouvrés à 5h30

  # Appel depuis un autre workflow
  workflow_call:
    inputs:
      version:
        required: true
        type: string
\`\`\`

## Secrets et variables

\`\`\`yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Utiliser un secret
        run: |
          curl -H "Authorization: Bearer \${{ secrets.API_TOKEN }}" \\
               https://api.example.com/deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

      - name: Utiliser des variables
        run: echo "Deploying to \${{ vars.DEPLOY_URL }}"
\`\`\`

## Actions du Marketplace

\`\`\`yaml
steps:
  # Cache des dépendances
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}

  # Notification Slack
  - uses: slackapi/slack-github-action@v1
    with:
      payload: |
        {"text": "Déploiement réussi! ✅"}
    env:
      SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}

  # Docker build et push
  - uses: docker/build-push-action@v5
    with:
      push: true
      tags: \${{ env.REGISTRY }}/\${{ github.repository }}:latest
\`\`\`

## Exercices

1. **Exercice 1** : Créez un workflow CI qui lint, teste et build un projet Node.js sur chaque pull request
2. **Exercice 2** : Ajoutez une matrice de tests pour tester sur Node 18, 20 et 22
3. **Exercice 3** : Configurez un déploiement automatique sur push vers main avec un secret pour le token de déploiement
`;


export const cicdGitlabCI = `# GitLab CI/CD

## Présentation

**GitLab CI/CD** est le système d'intégration et de déploiement continu intégré à GitLab. Il se configure via un fichier \`.gitlab-ci.yml\` à la racine du projet.

## Structure du fichier .gitlab-ci.yml

\`\`\`yaml
# .gitlab-ci.yml
image: node:20-alpine

stages:
  - install
  - quality
  - test
  - build
  - deploy

variables:
  NPM_CONFIG_CACHE: "$CI_PROJECT_DIR/.npm"
  NODE_ENV: "test"

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/
    - node_modules/

# --- Stage: Install ---
install_dependencies:
  stage: install
  script:
    - npm ci --cache .npm --prefer-offline
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

# --- Stage: Quality ---
lint:
  stage: quality
  needs: [install_dependencies]
  script:
    - npm run lint
  allow_failure: false

code_quality:
  stage: quality
  needs: [install_dependencies]
  script:
    - npm run lint -- --format json --output-file gl-code-quality-report.json
  artifacts:
    reports:
      codequality: gl-code-quality-report.json

# --- Stage: Test ---
unit_tests:
  stage: test
  needs: [install_dependencies]
  script:
    - npm run test -- --coverage
  coverage: '/All files[^|]*\\|[^|]*\\s+([\\d\\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

integration_tests:
  stage: test
  needs: [install_dependencies]
  services:
    - postgres:15
    - redis:7
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
    DATABASE_URL: "postgresql://test_user:test_pass@postgres:5432/test_db"
  script:
    - npm run test:integration

# --- Stage: Build ---
build_app:
  stage: build
  needs: [unit_tests, lint]
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

build_docker:
  stage: build
  needs: [unit_tests, lint]
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
    - tags

# --- Stage: Deploy ---
deploy_staging:
  stage: deploy
  needs: [build_app]
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - apt-get update && apt-get install -y rsync
    - rsync -avz dist/ user@staging-server:/app/
  only:
    - develop

deploy_production:
  stage: deploy
  needs: [build_app]
  environment:
    name: production
    url: https://www.example.com
  script:
    - ./scripts/deploy-production.sh
  when: manual
  only:
    - main
\`\`\`

## Concepts clés

### Stages et Jobs

| Concept | Description |
|---------|-------------|
| Stage | Phase du pipeline (build, test, deploy) |
| Job | Tâche exécutée dans un stage |
| needs | Dépendance entre jobs (DAG) |
| artifacts | Fichiers partagés entre jobs |
| cache | Fichiers persistés entre pipelines |

### Variables prédéfinies

| Variable | Description |
|----------|-------------|
| \`CI_COMMIT_SHA\` | SHA du commit |
| \`CI_COMMIT_REF_NAME\` | Nom de la branche ou tag |
| \`CI_PIPELINE_ID\` | ID unique du pipeline |
| \`CI_PROJECT_DIR\` | Répertoire du projet |
| \`CI_REGISTRY_IMAGE\` | Chemin de l'image dans le registre |
| \`CI_ENVIRONMENT_NAME\` | Nom de l'environnement |

### Runners

Les **runners** sont les agents qui exécutent les jobs :

\`\`\`yaml
# Utiliser un runner spécifique par tag
deploy_production:
  tags:
    - production
    - linux
  script:
    - ./deploy.sh
\`\`\`

Types de runners :
- **Shared runners** : Fournis par GitLab, partagés entre projets
- **Group runners** : Partagés au sein d'un groupe
- **Project runners** : Dédiés à un projet spécifique

### Artifacts et Reports

\`\`\`yaml
test:
  script:
    - npm test
  artifacts:
    paths:
      - coverage/
    reports:
      junit: test-results.xml
    expire_in: 30 days
    when: always  # Garder même si le job échoue
\`\`\`

## Exercices

1. **Exercice 1** : Créez un fichier \`.gitlab-ci.yml\` avec les stages install, test et build pour un projet Node.js
2. **Exercice 2** : Ajoutez un job d'intégration avec un service PostgreSQL
3. **Exercice 3** : Configurez un déploiement multi-environnement (staging automatique, production manuelle)
`;


export const cicdJenkins = `# Jenkins

## Présentation

**Jenkins** est un serveur d'automatisation open source écrit en Java. C'est l'un des outils CI/CD les plus anciens et les plus utilisés, reconnu pour sa flexibilité et son immense écosystème de plugins.

## Installation

### Avec Docker

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=true
    restart: unless-stopped

volumes:
  jenkins_data:
\`\`\`

### Installation native (Ubuntu/Debian)

\`\`\`bash
# Ajouter la clé et le dépôt Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \\
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \\
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \\
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Installer Jenkins
sudo apt update
sudo apt install jenkins

# Démarrer le service
sudo systemctl start jenkins
sudo systemctl enable jenkins
\`\`\`

## Jenkinsfile - Pipeline as Code

### Pipeline déclarative

\`\`\`groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'mon-app'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Quality') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Security Audit') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --coverage'
            }
            post {
                always {
                    junit 'test-results/**/*.xml'
                    publishHTML(target: [
                        reportName: 'Coverage Report',
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html'
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.build("\${REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh './scripts/deploy.sh staging'
            }
        }

        stage('Deploy Production') {
            when {
                branch 'main'
            }
            input {
                message "Déployer en production ?"
                ok "Oui, déployer"
                submitter "admin,deployer"
            }
            steps {
                sh './scripts/deploy.sh production'
            }
        }
    }

    post {
        success {
            slackSend(color: 'good', message: "Build réussi: \${env.JOB_NAME} #\${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(color: 'danger', message: "Build échoué: \${env.JOB_NAME} #\${env.BUILD_NUMBER}")
        }
        always {
            cleanWs()
        }
    }
}
\`\`\`

### Pipeline scriptée

\`\`\`groovy
// Pipeline scriptée (plus flexible)
node('linux') {
    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Build') {
            sh 'npm ci && npm run build'
        }

        stage('Test') {
            sh 'npm test'
        }

        if (env.BRANCH_NAME == 'main') {
            stage('Deploy') {
                withCredentials([string(credentialsId: 'deploy-token', variable: 'TOKEN')]) {
                    sh "deploy --token \$TOKEN"
                }
            }
        }
    } catch (e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        cleanWs()
    }
}
\`\`\`

## Plugins essentiels

| Plugin | Fonction |
|--------|----------|
| Pipeline | Support des Jenkinsfile |
| Git | Intégration Git |
| Docker Pipeline | Build Docker dans les pipelines |
| Blue Ocean | Interface moderne |
| Slack Notification | Notifications Slack |
| Credentials | Gestion des secrets |
| JUnit | Rapports de tests |
| SonarQube Scanner | Analyse de qualité |

## Agents

\`\`\`groovy
pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /tmp:/tmp'
        }
    }
    // ou agent par label
    // agent { label 'docker && linux' }
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm ci && npm run build'
            }
        }
    }
}
\`\`\`

## Exercices

1. **Exercice 1** : Installez Jenkins avec Docker et configurez le premier pipeline
2. **Exercice 2** : Créez un Jenkinsfile déclaratif avec stages parallèles pour lint et tests
3. **Exercice 3** : Ajoutez une étape de déploiement conditionnel avec validation manuelle
`;


export const cicdDocker = `# CI/CD avec Docker

## Présentation

L'intégration de **Docker** dans les pipelines CI/CD permet de créer des environnements reproductibles, d'automatiser la construction d'images et de garantir la cohérence entre les environnements.

## Construction d'images dans le CI

### Dockerfile optimisé pour le CI

\`\`\`dockerfile
# Dockerfile multi-stage optimisé
# Stage 1: Dépendances
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

### GitHub Actions - Build et Push

\`\`\`yaml
# .github/workflows/docker.yml
name: Docker Build & Push

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64
\`\`\`

### GitLab CI - Build et Push

\`\`\`yaml
# .gitlab-ci.yml
build_image:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build
        --cache-from $CI_REGISTRY_IMAGE:latest
        --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
        --tag $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
\`\`\`

## Builds multi-architecture

\`\`\`yaml
# GitHub Actions - Multi-arch build
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build multi-arch image
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64,linux/arm/v7
    push: true
    tags: myapp:latest
\`\`\`

## Stratégies de cache

| Stratégie | Avantage | Inconvénient |
|-----------|----------|--------------|
| Cache GHA | Intégré à GitHub | Limité à 10 GB |
| Cache Registry | Partagé entre runners | Nécessite un pull |
| Cache local | Très rapide | Non partagé |
| BuildKit inline | Simple | Moins performant |

\`\`\`yaml
# Cache avec registre
- name: Build with registry cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=registry,ref=myapp:buildcache
    cache-to: type=registry,ref=myapp:buildcache,mode=max
\`\`\`

## Push vers différents registres

\`\`\`yaml
# Comparaison des registres
registres:
  docker_hub:
    login: docker login -u USER -p TOKEN
    image: username/app:tag

  ghcr:
    login: docker login ghcr.io -u USER -p GITHUB_TOKEN
    image: ghcr.io/org/app:tag

  ecr:
    login: aws ecr get-login-password | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com
    image: ACCOUNT.dkr.ecr.REGION.amazonaws.com/app:tag

  gcr:
    login: gcloud auth configure-docker
    image: gcr.io/project-id/app:tag
\`\`\`

## Scan de sécurité des images

\`\`\`yaml
# Scan avec Trivy dans GitHub Actions
- name: Scan image for vulnerabilities
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'

- name: Upload scan results
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: 'trivy-results.sarif'
\`\`\`

## Exercices

1. **Exercice 1** : Créez un Dockerfile multi-stage pour une application Node.js et un workflow qui le build
2. **Exercice 2** : Configurez un build multi-architecture (amd64 + arm64) avec cache GHA
3. **Exercice 3** : Ajoutez un scan de sécurité Trivy qui bloque le pipeline en cas de vulnérabilité critique
`;


export const cicdBestPractices = `# Bonnes pratiques CI/CD

## Stratégies de branchement

### Git Flow

\`\`\`
main ─────────────────────────────────────────────
       \\                    /          \\
develop ───────────────────────────────────────────
         \\        /    \\        /
feature/A ────────      feature/B ────────
\`\`\`

| Branche | Rôle |
|---------|------|
| main | Code en production |
| develop | Intégration des features |
| feature/* | Développement de fonctionnalités |
| release/* | Préparation des releases |
| hotfix/* | Corrections urgentes |

### GitHub Flow (simplifié)

\`\`\`
main ─────────────────────────────────────
       \\        /    \\        /
feature/A ────────    feature/B ────────
\`\`\`

- Une seule branche principale (main)
- Feature branches courtes
- Pull Requests pour la revue
- Déploiement après merge dans main

### Trunk-Based Development

\`\`\`
main ────────────────────────────────────────
      \\ /   \\ /   \\ /   \\ /   \\ /
       x     x     x     x     x  (commits directs ou PR très courtes)
\`\`\`

- Commits fréquents sur main
- Feature flags pour les fonctionnalités en cours
- Branches très courtes (< 1 jour)
- Idéal pour le déploiement continu

## Versionnement sémantique (SemVer)

### Format : MAJOR.MINOR.PATCH

\`\`\`
v2.3.1
│ │ └── PATCH : corrections de bugs (rétrocompatible)
│ └──── MINOR : nouvelles fonctionnalités (rétrocompatible)
└────── MAJOR : changements incompatibles (breaking changes)
\`\`\`

### Automatisation avec Conventional Commits

\`\`\`yaml
# Exemple avec semantic-release dans GitHub Actions
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
\`\`\`

### Convention des commits

| Préfixe | Impact version | Exemple |
|---------|---------------|---------|
| fix: | PATCH | fix: corriger la validation email |
| feat: | MINOR | feat: ajouter export CSV |
| feat!: | MAJOR | feat!: refonte API authentification |
| chore: | Aucun | chore: mise à jour dépendances |
| docs: | Aucun | docs: améliorer le README |

## Stratégies de déploiement

### Blue-Green Deployment

\`\`\`yaml
# Principe : deux environnements identiques
deploy_blue_green:
  script:
    # 1. Déployer sur l'environnement inactif (green)
    - deploy --target green --version $NEW_VERSION

    # 2. Exécuter les smoke tests
    - run_smoke_tests --target green

    # 3. Basculer le traffic vers green
    - switch_traffic --from blue --to green

    # 4. L'ancien environnement (blue) devient le backup
    - mark_as_standby --target blue
\`\`\`

**Avantages :**
- Rollback instantané (rebascule le traffic)
- Zéro downtime
- Test en conditions réelles avant bascule

### Canary Deployment

\`\`\`yaml
# Déploiement progressif
deploy_canary:
  script:
    # Phase 1 : 5% du traffic
    - deploy --canary --weight 5 --version $NEW_VERSION
    - wait_and_monitor --duration 10m --error-threshold 1%

    # Phase 2 : 25% du traffic
    - deploy --canary --weight 25 --version $NEW_VERSION
    - wait_and_monitor --duration 30m --error-threshold 0.5%

    # Phase 3 : 100% du traffic
    - deploy --promote --version $NEW_VERSION
\`\`\`

**Avantages :**
- Risque limité (exposition progressive)
- Détection précoce des problèmes
- Rollback facile aux premières étapes

### Rolling Update

\`\`\`yaml
# Kubernetes rolling update
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 1 pod supplémentaire max
      maxUnavailable: 0  # Aucun pod indisponible
  template:
    spec:
      containers:
        - name: app
          image: mon-app:v2.0.0
\`\`\`

## Stratégies de rollback

\`\`\`yaml
# Rollback automatique sur échec
deploy_with_rollback:
  script:
    - PREVIOUS_VERSION=$(get_current_version)
    - deploy --version $NEW_VERSION
    - |
      if ! run_health_checks; then
        echo "Health check failed, rolling back..."
        deploy --version $PREVIOUS_VERSION
        notify --channel alerts --message "Rollback to $PREVIOUS_VERSION"
        exit 1
      fi
\`\`\`

## Comparaison des stratégies

| Stratégie | Downtime | Risque | Coût infra | Complexité |
|-----------|----------|--------|------------|------------|
| Recreate | Oui | Élevé | Faible | Simple |
| Rolling Update | Non | Moyen | Moyen | Moyenne |
| Blue-Green | Non | Faible | Élevé (x2) | Moyenne |
| Canary | Non | Très faible | Moyen | Élevée |
| A/B Testing | Non | Faible | Moyen | Élevée |

## Bonnes pratiques générales

1. **Garder les pipelines rapides** : Objectif < 10 minutes pour le feedback
2. **Paralléliser les jobs** : Lint, tests unitaires et sécurité en parallèle
3. **Fail fast** : Mettre les étapes les plus rapides en premier
4. **Environnements éphémères** : Créer des environnements de review par PR
5. **Infrastructure as Code** : Versionner la configuration des pipelines
6. **Secrets management** : Ne jamais hardcoder les secrets, utiliser un vault
7. **Observabilité** : Monitorer les déploiements et configurer des alertes
8. **Tests de fumée** : Valider chaque déploiement avec des smoke tests
9. **Feature flags** : Découpler le déploiement de l'activation des fonctionnalités
10. **Documentation** : Documenter les procédures de rollback et d'incident

## Exercices

1. **Exercice 1** : Choisissez une stratégie de branchement pour votre équipe et justifiez votre choix
2. **Exercice 2** : Implémentez un pipeline avec semantic-release et conventional commits
3. **Exercice 3** : Concevez une stratégie de déploiement canary avec rollback automatique pour une API REST
`;
