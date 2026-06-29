export const prometheusIntro = `# Introduction au Monitoring avec Prometheus

## Pourquoi monitorer ?

Le monitoring est un pilier essentiel du DevOps. Il permet de :

- **Détecter les problèmes** avant qu'ils n'impactent les utilisateurs
- **Comprendre les performances** de vos systèmes
- **Anticiper les besoins** en capacité (capacity planning)
- **Valider les déploiements** en temps réel
- **Analyser les incidents** post-mortem (root cause analysis)

## Les quatre signaux d'or (Golden Signals)

| Signal | Description | Exemple |
|--------|-------------|---------|
| Latence | Temps de réponse des requêtes | p99 < 200ms |
| Traffic | Volume de requêtes | Requêtes/seconde |
| Erreurs | Taux de requêtes en échec | Taux d'erreur < 0.1% |
| Saturation | Utilisation des ressources | CPU < 80% |

## Qu'est-ce que Prometheus ?

**Prometheus** est un système de monitoring et d'alerting open source, créé par SoundCloud et maintenant partie de la Cloud Native Computing Foundation (CNCF).

### Caractéristiques principales

- **Modèle de données multidimensionnel** : métriques identifiées par nom et paires clé/valeur (labels)
- **PromQL** : langage de requête puissant et flexible
- **Modèle Pull** : Prometheus scrape les cibles (vs push)
- **Service discovery** : découverte automatique des cibles
- **Alerting intégré** : via Alertmanager
- **Stockage local** : base de données time-series intégrée

## Architecture de Prometheus

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Prometheus Server                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ Retrieval │  │  TSDB    │  │     HTTP Server       │  │
│  │  (scrape) │  │ (storage)│  │  (PromQL, API, UI)    │  │
│  └─────┬─────┘  └──────────┘  └───────────────────────┘  │
│        │                                                  │
└────────┼──────────────────────────────────────────────────┘
         │ scrape (pull)
         ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   Application  │  │    Node        │  │   Service      │
│   /metrics     │  │   Exporter     │  │   Mesh         │
└────────────────┘  └────────────────┘  └────────────────┘

         Alertmanager
         ┌──────────────────────┐
         │  Routing / Grouping  │──► Email, Slack, PagerDuty
         └──────────────────────┘

         Grafana
         ┌──────────────────────┐
         │  Dashboards / Panels │◄── PromQL queries
         └──────────────────────┘
\`\`\`

## Modèle Pull vs Push

| Aspect | Pull (Prometheus) | Push (StatsD, InfluxDB) |
|--------|-------------------|------------------------|
| Initiative | Le serveur scrape les cibles | Les cibles envoient les données |
| Découverte | Service discovery | Enregistrement manuel |
| Santé cibles | Détectable (scrape échoue) | Non détectable directement |
| Réseau | Le serveur doit atteindre les cibles | Les cibles doivent atteindre le serveur |
| Jobs éphémères | Pushgateway nécessaire | Natif |

## Bases de PromQL

### Sélection de métriques

\`\`\`promql
# Métrique brute
http_requests_total

# Avec filtres de labels
http_requests_total{method="GET", status="200"}

# Avec regex
http_requests_total{method=~"GET|POST", path!~"/health.*"}
\`\`\`

### Fonctions courantes

\`\`\`promql
# Taux de requêtes par seconde (sur 5 minutes)
rate(http_requests_total[5m])

# Augmentation sur une période
increase(http_requests_total[1h])

# Percentile de latence (p95)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Moyenne par instance
avg by (instance) (cpu_usage_percent)

# Top 5 des endpoints les plus lents
topk(5, avg by (path) (rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])))
\`\`\`

### Opérateurs

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| rate() | Taux par seconde | rate(counter[5m]) |
| increase() | Augmentation totale | increase(counter[1h]) |
| sum() | Somme | sum by (job) (metric) |
| avg() | Moyenne | avg(metric) |
| max() / min() | Maximum / Minimum | max by (instance) (metric) |
| histogram_quantile() | Percentile | histogram_quantile(0.99, ...) |

## Exercices

1. **Exercice 1** : Identifiez les quatre signaux d'or pour une application e-commerce
2. **Exercice 2** : Écrivez une requête PromQL pour calculer le taux d'erreur HTTP (status >= 500) sur les 5 dernières minutes
3. **Exercice 3** : Expliquez pourquoi le modèle pull est avantageux pour détecter les services tombés
`;


export const prometheusInstallation = `# Installation de Prometheus

## Installation avec Docker Compose

### Configuration complète

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.50.0
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/rules/:/etc/prometheus/rules/
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    restart: unless-stopped
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    restart: unless-stopped
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:v1.7.0
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    networks:
      - monitoring

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    restart: unless-stopped
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:10.3.0
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning/:/etc/grafana/provisioning/
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=secret
      - GF_USERS_ALLOW_SIGN_UP=false
    restart: unless-stopped
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
\`\`\`

## Configuration de Prometheus

### Fichier principal

\`\`\`yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s          # Fréquence de scrape par défaut
  evaluation_interval: 15s      # Fréquence d'évaluation des règles
  scrape_timeout: 10s           # Timeout de scrape

# Fichiers de règles d'alerting
rule_files:
  - "rules/*.yml"

# Configuration de l'Alertmanager
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Configuration des cibles à scraper
scrape_configs:
  # Prometheus se monitore lui-même
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter - métriques système
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
        labels:
          environment: 'production'
          datacenter: 'paris'

  # cAdvisor - métriques Docker
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # Application - métriques custom
  - job_name: 'mon-application'
    metrics_path: '/metrics'
    scrape_interval: 10s
    static_configs:
      - targets: ['app:3000']
        labels:
          app: 'mon-app'
          version: 'v2.1.0'

  # Scrape avec authentification
  - job_name: 'app-securisee'
    scheme: https
    basic_auth:
      username: 'prometheus'
      password: 'secret'
    tls_config:
      insecure_skip_verify: false
      ca_file: /etc/prometheus/certs/ca.pem
    static_configs:
      - targets: ['secure-app:8443']
\`\`\`

## Service Discovery

### Docker Service Discovery

\`\`\`yaml
scrape_configs:
  - job_name: 'docker-containers'
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 30s
    relabel_configs:
      - source_labels: [__meta_docker_container_label_prometheus_scrape]
        regex: 'true'
        action: keep
      - source_labels: [__meta_docker_container_name]
        target_label: container_name
        regex: '/(.*)'
\`\`\`

### Kubernetes Service Discovery

\`\`\`yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
\`\`\`

### Consul Service Discovery

\`\`\`yaml
scrape_configs:
  - job_name: 'consul-services'
    consul_sd_configs:
      - server: 'consul:8500'
        services: []
    relabel_configs:
      - source_labels: [__meta_consul_tags]
        regex: '.*,monitoring,.*'
        action: keep
      - source_labels: [__meta_consul_service]
        target_label: service
\`\`\`

## Comparaison des méthodes de découverte

| Méthode | Cas d'usage | Dynamique |
|---------|-------------|-----------|
| static_configs | Environnements simples | Non |
| docker_sd | Conteneurs Docker | Oui |
| kubernetes_sd | Clusters Kubernetes | Oui |
| consul_sd | Infra avec Consul | Oui |
| file_sd | Fichiers JSON/YAML mis à jour | Semi |
| dns_sd | Découverte DNS | Oui |

## Vérification de l'installation

\`\`\`bash
# Lancer la stack
docker compose up -d

# Vérifier que Prometheus est accessible
curl http://localhost:9090/-/healthy

# Vérifier les cibles
curl http://localhost:9090/api/v1/targets | jq .

# Recharger la configuration (sans redémarrage)
curl -X POST http://localhost:9090/-/reload
\`\`\`

## Exercices

1. **Exercice 1** : Déployez la stack complète avec Docker Compose et vérifiez que toutes les cibles sont "UP"
2. **Exercice 2** : Ajoutez une application Node.js comme cible avec des labels personnalisés
3. **Exercice 3** : Configurez le service discovery Docker pour découvrir automatiquement les conteneurs avec un label spécifique
`;


export const prometheusMetrics = `# Types de métriques Prometheus

## Les quatre types de métriques

### 1. Counter (Compteur)

Un **counter** est une valeur qui ne peut qu'augmenter (ou être remise à zéro au redémarrage). Utilisé pour compter des événements.

**Exemples :** nombre de requêtes, erreurs, octets transférés

\`\`\`promql
# Requêtes PromQL pour les counters
# Taux par seconde sur 5 minutes
rate(http_requests_total[5m])

# Augmentation sur 1 heure
increase(http_requests_total[1h])

# Taux par méthode HTTP
sum by (method) (rate(http_requests_total[5m]))
\`\`\`

### 2. Gauge (Jauge)

Un **gauge** est une valeur qui peut monter ou descendre. Représente un état instantané.

**Exemples :** température, utilisation mémoire, nombre de goroutines actives

\`\`\`promql
# Requêtes PromQL pour les gauges
# Valeur actuelle
node_memory_MemAvailable_bytes

# Moyenne sur 5 minutes
avg_over_time(node_cpu_seconds_total[5m])

# Prédiction (dans 4h à ce rythme)
predict_linear(node_filesystem_free_bytes[1h], 4*3600)
\`\`\`

### 3. Histogram (Histogramme)

Un **histogram** échantillonne les observations et les regroupe dans des buckets configurables. Idéal pour mesurer les latences.

**Exemples :** durée des requêtes, taille des réponses

\`\`\`promql
# Percentile 95 de la latence
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Percentile 99 par endpoint
histogram_quantile(0.99,
  sum by (path, le) (rate(http_request_duration_seconds_bucket[5m]))
)

# Latence moyenne
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
\`\`\`

### 4. Summary (Résumé)

Un **summary** calcule les quantiles côté client. Similaire à l'histogram mais les quantiles sont pré-calculés.

**Différences avec Histogram :**

| Aspect | Histogram | Summary |
|--------|-----------|---------|
| Calcul quantiles | Côté serveur (PromQL) | Côté client |
| Agrégation | Possible entre instances | Impossible |
| Précision | Dépend des buckets | Configurable (erreur) |
| Coût CPU | Serveur | Client |
| Recommandé pour | La plupart des cas | Quantiles exacts |

## Instrumentation Node.js

### Installation

\`\`\`bash
npm install prom-client
\`\`\`

### Exemple complet

\`\`\`typescript
// src/metrics.ts
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Créer un registre
const register = new Registry();

// Collecter les métriques par défaut (CPU, mémoire, event loop)
collectDefaultMetrics({ register });

// Counter - Nombre de requêtes HTTP
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
});

// Histogram - Durée des requêtes
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

// Gauge - Connexions actives
export const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Nombre de connexions HTTP actives',
  registers: [register],
});

// Gauge - Informations de version
export const appInfo = new Gauge({
  name: 'app_info',
  help: 'Information sur application',
  labelNames: ['version', 'node_version'],
  registers: [register],
});
appInfo.set({ version: '2.1.0', node_version: process.version }, 1);

export { register };
\`\`\`

### Middleware Express

\`\`\`typescript
// src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpRequestDuration, activeConnections } from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  activeConnections.inc();
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const labels = {
      method: req.method,
      path: req.route?.path || req.path,
      status: res.statusCode.toString(),
    };

    httpRequestsTotal.inc(labels);
    end(labels);
    activeConnections.dec();
  });

  next();
}
\`\`\`

### Endpoint /metrics

\`\`\`typescript
// src/app.ts
import express from 'express';
import { register } from './metrics';
import { metricsMiddleware } from './middleware/metrics';

const app = express();

// Appliquer le middleware
app.use(metricsMiddleware);

// Endpoint pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000);
\`\`\`

## Instrumentation Python

\`\`\`python
# app.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Métriques
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Nombre total de requêtes',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'Latence des requêtes en secondes',
    ['method', 'endpoint'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

ACTIVE_REQUESTS = Gauge(
    'http_active_requests',
    'Requêtes en cours de traitement'
)

# Décorateur pour mesurer la latence
def track_request(method, endpoint):
    def decorator(func):
        def wrapper(*args, **kwargs):
            ACTIVE_REQUESTS.inc()
            start = time.time()
            try:
                result = func(*args, **kwargs)
                REQUEST_COUNT.labels(method, endpoint, '200').inc()
                return result
            except Exception as e:
                REQUEST_COUNT.labels(method, endpoint, '500').inc()
                raise
            finally:
                REQUEST_LATENCY.labels(method, endpoint).observe(time.time() - start)
                ACTIVE_REQUESTS.dec()
        return wrapper
    return decorator

# Démarrer le serveur de métriques sur le port 8000
start_http_server(8000)
\`\`\`

## Bonnes pratiques de nommage

| Convention | Exemple | Explication |
|------------|---------|-------------|
| Suffixe _total | http_requests_total | Counter |
| Suffixe _seconds | request_duration_seconds | Durée |
| Suffixe _bytes | response_size_bytes | Taille |
| Suffixe _info | app_info | Métadonnées |
| Préfixe namespace | myapp_http_requests_total | Éviter les conflits |

## Exercices

1. **Exercice 1** : Instrumentez une API Express avec les 4 types de métriques
2. **Exercice 2** : Créez un histogramme de latence avec des buckets adaptés à votre SLA (p99 < 500ms)
3. **Exercice 3** : Écrivez les requêtes PromQL pour calculer le taux d'erreur, la latence p95 et le throughput
`;


export const prometheusAlerting = `# Alerting avec Prometheus

## Architecture d'alerting

\`\`\`
┌──────────────┐         ┌────────────────┐         ┌──────────────┐
│  Prometheus  │────────►│  Alertmanager  │────────►│  Receivers   │
│  (rules)     │  push   │  (routing)     │  notify │  (Slack,     │
│              │  alerts  │                │         │   Email...)  │
└──────────────┘         └────────────────┘         └──────────────┘
\`\`\`

**Flux :**
1. Prometheus évalue les **règles d'alerte** à intervalle régulier
2. Si une condition est remplie, l'alerte passe en état **pending** puis **firing**
3. L'alerte est envoyée à **Alertmanager**
4. Alertmanager **route**, **groupe** et **déduplique** les alertes
5. Les notifications sont envoyées aux **receivers** configurés

## Règles d'alerte Prometheus

\`\`\`yaml
# prometheus/rules/alerting.yml
groups:
  - name: application
    rules:
      # Taux d'erreur élevé
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))
          > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "Taux d'erreur élevé ({{ $value | humanizePercentage }})"
          description: "Le taux d'erreur HTTP 5xx dépasse 5% depuis 5 minutes."
          runbook_url: "https://wiki.example.com/runbooks/high-error-rate"

      # Latence élevée
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
          ) > 1
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Latence p95 élevée ({{ $value | humanizeDuration }})"
          description: "La latence p95 dépasse 1 seconde depuis 10 minutes."

      # Application down
      - alert: ApplicationDown
        expr: up{job="mon-application"} == 0
        for: 1m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "Application {{ $labels.instance }} down"
          description: "L'instance {{ $labels.instance }} ne répond plus depuis 1 minute."

  - name: infrastructure
    rules:
      # Disque presque plein
      - alert: DiskSpaceRunningLow
        expr: |
          (node_filesystem_avail_bytes{fstype!~"tmpfs|fuse.*"}
          / node_filesystem_size_bytes) * 100 < 15
        for: 15m
        labels:
          severity: warning
          team: infra
        annotations:
          summary: "Espace disque faible sur {{ $labels.instance }}"
          description: "Partition {{ $labels.mountpoint }} : {{ $value | printf \"%.1f\" }}% restant."

      # Mémoire élevée
      - alert: HighMemoryUsage
        expr: |
          (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
        for: 10m
        labels:
          severity: warning
          team: infra
        annotations:
          summary: "Utilisation mémoire élevée sur {{ $labels.instance }}"
          description: "Utilisation mémoire à {{ $value | printf \"%.1f\" }}%."

      # CPU saturé
      - alert: HighCPUUsage
        expr: |
          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 15m
        labels:
          severity: warning
          team: infra
        annotations:
          summary: "CPU élevé sur {{ $labels.instance }}"
          description: "Utilisation CPU à {{ $value | printf \"%.1f\" }}% depuis 15 minutes."
\`\`\`

## Configuration de l'Alertmanager

\`\`\`yaml
# alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m
  smtp_from: 'alertmanager@example.com'
  smtp_smarthost: 'smtp.example.com:587'
  smtp_auth_username: 'alertmanager@example.com'
  smtp_auth_password: 'secret'

# Templates personnalisés
templates:
  - '/etc/alertmanager/templates/*.tmpl'

# Arbre de routage
route:
  receiver: 'default-slack'
  group_by: ['alertname', 'team']
  group_wait: 30s          # Attendre avant d'envoyer le premier message
  group_interval: 5m       # Intervalle entre les messages d'un groupe
  repeat_interval: 4h      # Ré-envoyer si non résolu
  routes:
    # Alertes critiques → PagerDuty + Slack
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true
    - match:
        severity: critical
      receiver: 'slack-critical'

    # Alertes par équipe
    - match:
        team: backend
      receiver: 'slack-backend'
    - match:
        team: infra
      receiver: 'slack-infra'

    # Alertes pendant les heures ouvrées uniquement
    - match:
        severity: warning
      receiver: 'email-warning'
      active_time_intervals:
        - business-hours

# Périodes de temps
time_intervals:
  - name: business-hours
    time_intervals:
      - weekdays: ['monday:friday']
        times:
          - start_time: '09:00'
            end_time: '18:00'

# Inhibitions (supprimer les alertes redondantes)
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']

# Receivers
receivers:
  - name: 'default-slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'slack-critical'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#alerts-critical'
        color: '{{ if eq .Status "firing" }}danger{{ else }}good{{ end }}'
        title: '🚨 {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: 'slack-backend'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#team-backend-alerts'

  - name: 'slack-infra'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#team-infra-alerts'

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'
        severity: 'critical'

  - name: 'email-warning'
    email_configs:
      - to: 'team@example.com'
        send_resolved: true
\`\`\`

## Bonnes pratiques d'alerting

| Pratique | Description |
|----------|-------------|
| Alerter sur les symptômes | Alerter sur la latence, pas sur le CPU |
| Durée \`for\` appropriée | Éviter les faux positifs avec un délai |
| Labels de sévérité | critical, warning, info |
| Runbook URL | Lien vers la procédure de résolution |
| Grouper les alertes | Éviter le flood de notifications |
| Inhibitions | Supprimer les alertes redondantes |
| Tester les alertes | Valider les expressions PromQL |

## Exercices

1. **Exercice 1** : Créez une règle d'alerte pour un taux d'erreur > 1% pendant 5 minutes
2. **Exercice 2** : Configurez Alertmanager avec routage par équipe et sévérité
3. **Exercice 3** : Mettez en place des inhibitions pour éviter les alertes warning quand une alerte critical est active sur la même instance
`;


export const grafanaIntro = `# Introduction à Grafana

## Qu'est-ce que Grafana ?

**Grafana** est une plateforme open source de visualisation et d'observabilité. Elle permet de créer des dashboards interactifs à partir de multiples sources de données.

## Installation

### Avec Docker

\`\`\`yaml
# docker-compose.yml (extrait)
grafana:
  image: grafana/grafana:10.3.0
  container_name: grafana
  ports:
    - "3000:3000"
  volumes:
    - grafana_data:/var/lib/grafana
    - ./grafana/provisioning:/etc/grafana/provisioning
    - ./grafana/dashboards:/var/lib/grafana/dashboards
  environment:
    - GF_SECURITY_ADMIN_USER=admin
    - GF_SECURITY_ADMIN_PASSWORD=changeme
    - GF_USERS_ALLOW_SIGN_UP=false
    - GF_SERVER_ROOT_URL=https://grafana.example.com
    - GF_SMTP_ENABLED=true
    - GF_SMTP_HOST=smtp.example.com:587
  restart: unless-stopped
\`\`\`

### Configuration des variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| GF_SECURITY_ADMIN_USER | Nom d'utilisateur admin | admin |
| GF_SECURITY_ADMIN_PASSWORD | Mot de passe admin | admin |
| GF_USERS_ALLOW_SIGN_UP | Autoriser l'inscription | true |
| GF_AUTH_ANONYMOUS_ENABLED | Accès anonyme | false |
| GF_SERVER_ROOT_URL | URL publique | http://localhost:3000 |
| GF_DATABASE_TYPE | Type de BDD | sqlite3 |
| GF_INSTALL_PLUGINS | Plugins à installer | (vide) |

## Sources de données (Data Sources)

### Configuration de Prometheus comme source

\`\`\`yaml
# grafana/provisioning/datasources/prometheus.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
    jsonData:
      timeInterval: '15s'
      httpMethod: POST

  - name: Prometheus-Longterm
    type: prometheus
    access: proxy
    url: http://thanos-query:9090
    jsonData:
      timeInterval: '60s'

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
\`\`\`

### Sources de données supportées

| Source | Type | Cas d'usage |
|--------|------|-------------|
| Prometheus | Métriques | Monitoring infrastructure et apps |
| Loki | Logs | Centralisation des logs |
| Elasticsearch | Logs/Métriques | Recherche et analyse |
| InfluxDB | Métriques | IoT, données temporelles |
| PostgreSQL | SQL | Données métier |
| MySQL | SQL | Données métier |
| CloudWatch | Métriques | AWS |
| Tempo | Traces | Distributed tracing |

## Concepts des dashboards

### Structure

\`\`\`
Dashboard
├── Variables (filtres dynamiques)
├── Row 1: Vue d'ensemble
│   ├── Panel: Stat (requêtes/s)
│   ├── Panel: Gauge (taux d'erreur)
│   └── Panel: Stat (latence p95)
├── Row 2: Détails
│   ├── Panel: Time series (latence)
│   └── Panel: Time series (throughput)
└── Row 3: Infrastructure
    ├── Panel: Time series (CPU)
    └── Panel: Time series (Mémoire)
\`\`\`

### Types de panels

| Panel | Usage | Exemple |
|-------|-------|---------|
| Time series | Évolution temporelle | Latence, CPU |
| Stat | Valeur unique | Requêtes/s, uptime |
| Gauge | Jauge avec seuils | Utilisation disque |
| Bar gauge | Barres comparatives | Top endpoints |
| Table | Données tabulaires | Liste d'alertes |
| Heatmap | Distribution | Latence par bucket |
| Pie chart | Répartition | Codes HTTP |
| Logs | Logs en temps réel | Logs applicatifs |
| Alert list | Alertes actives | État du système |

## Variables de dashboard

### Définition

\`\`\`
Variable: environment
Type: Query
Query: label_values(up, environment)
Résultat: [production, staging, development]

Variable: instance
Type: Query
Query: label_values(up{environment="$environment"}, instance)
Résultat: [app-1:3000, app-2:3000, app-3:3000]
\`\`\`

### Utilisation dans les requêtes

\`\`\`promql
# Utiliser les variables dans les panels
rate(http_requests_total{environment="$environment", instance=~"$instance"}[5m])

# Variable multi-valeur avec regex
rate(http_requests_total{instance=~"$instance"}[$__rate_interval])
\`\`\`

### Variables spéciales Grafana

| Variable | Description | Exemple |
|----------|-------------|---------|
| $__rate_interval | Intervalle recommandé pour rate() | 1m, 5m |
| $__interval | Intervalle basé sur le range sélectionné | 15s, 1m |
| $__range | Durée du range sélectionné | 1h, 24h |
| $__from / $__to | Timestamps début/fin | epoch ms |

## Templating et liens

\`\`\`yaml
# Liens entre dashboards
links:
  - title: "Détails de l'instance"
    url: "/d/instance-detail?var-instance=\${__data.fields.instance}"
    targetBlank: true

  - title: "Logs associés"
    url: "/explore?datasource=Loki&expr={instance=\"\${__data.fields.instance}\"}"
\`\`\`

## Premier dashboard : SRE Golden Signals

\`\`\`promql
# Panel 1: Requêtes par seconde (Traffic)
sum(rate(http_requests_total{environment="$environment"}[5m]))

# Panel 2: Taux d'erreur (Errors)
sum(rate(http_requests_total{status=~"5..", environment="$environment"}[5m]))
/
sum(rate(http_requests_total{environment="$environment"}[5m]))

# Panel 3: Latence p95 (Latency)
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket{environment="$environment"}[5m]))
)

# Panel 4: Saturation CPU
100 - (avg(rate(node_cpu_seconds_total{mode="idle", environment="$environment"}[5m])) * 100)
\`\`\`

## Exercices

1. **Exercice 1** : Installez Grafana et connectez Prometheus comme source de données
2. **Exercice 2** : Créez un dashboard avec les 4 Golden Signals et des variables pour filtrer par environnement
3. **Exercice 3** : Ajoutez des seuils de couleur (vert/jaune/rouge) sur les panels Stat et Gauge
`;


export const grafanaDashboards = `# Dashboards avancés Grafana

## Panels personnalisés

### Transformations de données

Les transformations permettent de manipuler les données avant l'affichage :

\`\`\`yaml
# Transformations disponibles
transformations:
  - Reduce: Réduire les séries à une seule valeur (last, mean, max)
  - Filter by name: Filtrer les séries par nom
  - Organize fields: Réordonner, renommer, masquer des champs
  - Join by field: Joindre des requêtes par un champ commun
  - Group by: Grouper les résultats
  - Sort by: Trier les résultats
  - Calculate field: Créer un champ calculé
  - Merge: Fusionner plusieurs requêtes
\`\`\`

### Overrides (Surcharges)

\`\`\`yaml
# Personnaliser l'affichage par série
overrides:
  - matcher:
      id: byName
      options: "Erreurs"
    properties:
      - id: color
        value: { mode: fixed, fixedColor: red }
      - id: custom.fillOpacity
        value: 20
      - id: custom.lineWidth
        value: 2

  - matcher:
      id: byRegexp
      options: "/p99/"
    properties:
      - id: custom.lineStyle
        value: { fill: dash, dash: [10, 5] }
\`\`\`

### Value mappings

\`\`\`yaml
# Mapper des valeurs à des textes/couleurs
valueMappings:
  - type: value
    options:
      0: { text: "DOWN", color: red }
      1: { text: "UP", color: green }

  - type: range
    options:
      from: 0
      to: 50
      result: { text: "Faible", color: blue }

  - type: range
    options:
      from: 50
      to: 80
      result: { text: "Moyen", color: yellow }

  - type: range
    options:
      from: 80
      to: 100
      result: { text: "Élevé", color: red }
\`\`\`

## Alertes Grafana

### Règles d'alerte dans Grafana

\`\`\`yaml
# Alerte Grafana (Unified Alerting)
alert:
  name: "API - Taux d'erreur élevé"
  condition: C
  data:
    - refId: A
      datasource: Prometheus
      expr: sum(rate(http_requests_total{status=~"5.."}[5m]))
    - refId: B
      datasource: Prometheus
      expr: sum(rate(http_requests_total[5m]))
    - refId: C
      datasource: __expr__
      type: math
      expression: "$A / $B"
      conditions:
        - evaluator:
            type: gt
            params: [0.05]
          operator: and
  for: 5m
  labels:
    severity: critical
    team: backend
  annotations:
    summary: "Taux d'erreur > 5%"
    description: "Le taux d'erreur est de {{ $values.C }}%"
\`\`\`

### Contact points

| Type | Configuration |
|------|---------------|
| Email | SMTP server, destinataires |
| Slack | Webhook URL, channel |
| PagerDuty | Integration key |
| Microsoft Teams | Webhook URL |
| Discord | Webhook URL |
| Webhook | URL personnalisée, headers |

## Annotations

### Annotations automatiques

\`\`\`yaml
# Annoter les déploiements sur les graphiques
# Via l'API Grafana
curl -X POST http://grafana:3000/api/annotations \\
  -H "Authorization: Bearer $GRAFANA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dashboardUID": "abc123",
    "time": 1704067200000,
    "timeEnd": 1704067200000,
    "tags": ["deployment", "v2.1.0"],
    "text": "Déploiement v2.1.0 en production"
  }'
\`\`\`

### Dans un pipeline CI/CD

\`\`\`yaml
# GitHub Actions - Annoter les déploiements
- name: Annotate Grafana
  if: success()
  run: |
    curl -s -X POST "$GRAFANA_URL/api/annotations" \\
      -H "Authorization: Bearer $GRAFANA_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d "{
        \\"tags\\": [\\"deployment\\", \\"\${{ github.ref_name }}\\"],
        \\"text\\": \\"Deploy \${{ github.sha }} by \${{ github.actor }}\\"
      }"
  env:
    GRAFANA_URL: \${{ secrets.GRAFANA_URL }}
    GRAFANA_API_KEY: \${{ secrets.GRAFANA_API_KEY }}
\`\`\`

## Provisioning (Infrastructure as Code)

### Structure de provisioning

\`\`\`
grafana/
├── provisioning/
│   ├── datasources/
│   │   └── datasources.yml
│   ├── dashboards/
│   │   └── dashboards.yml
│   ├── alerting/
│   │   ├── rules.yml
│   │   └── contactpoints.yml
│   └── notifiers/
│       └── notifiers.yml
└── dashboards/
    ├── overview.json
    ├── infrastructure.json
    └── application.json
\`\`\`

### Configuration du provider de dashboards

\`\`\`yaml
# grafana/provisioning/dashboards/dashboards.yml
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: 'Provisioned'
    type: file
    disableDeletion: true
    updateIntervalSeconds: 30
    allowUiUpdates: false
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
\`\`\`

### Dashboard as JSON

\`\`\`json
{
  "dashboard": {
    "id": null,
    "uid": "app-overview",
    "title": "Application Overview",
    "tags": ["application", "overview"],
    "timezone": "Europe/Paris",
    "refresh": "30s",
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "templating": {
      "list": [
        {
          "name": "environment",
          "type": "query",
          "datasource": "Prometheus",
          "query": "label_values(up, environment)",
          "current": { "text": "production", "value": "production" },
          "multi": false
        }
      ]
    },
    "panels": [
      {
        "title": "Requêtes/s",
        "type": "stat",
        "gridPos": { "h": 4, "w": 6, "x": 0, "y": 0 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{environment=\\"$environment\\"}[5m]))",
            "legendFormat": "req/s"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "thresholds": {
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 1000 },
                { "color": "red", "value": 5000 }
              ]
            }
          }
        }
      }
    ]
  }
}
\`\`\`

## Partage et export

### Méthodes de partage

| Méthode | Cas d'usage | Authentification |
|---------|-------------|------------------|
| Lien direct | Équipe interne | Requise |
| Snapshot | Partage externe ponctuel | Non requise |
| Embed (iframe) | Intégration web | Configurable |
| PDF/PNG | Rapports | Via Grafana Image Renderer |
| Public dashboards | Accès public | Non requise |

### Export et import

\`\`\`bash
# Exporter un dashboard via l'API
curl -s "http://grafana:3000/api/dashboards/uid/app-overview" \\
  -H "Authorization: Bearer $API_KEY" | jq '.dashboard' > dashboard.json

# Importer un dashboard
curl -s -X POST "http://grafana:3000/api/dashboards/db" \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d @dashboard.json
\`\`\`

### Grafana as Code avec Grafonnet (Jsonnet)

\`\`\`jsonnet
// dashboard.jsonnet
local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local prometheus = grafana.prometheus;
local graphPanel = grafana.graphPanel;

dashboard.new(
  'Application Dashboard',
  tags=['application', 'generated'],
  refresh='30s',
)
.addPanel(
  graphPanel.new(
    'Requêtes par seconde',
    datasource='Prometheus',
  )
  .addTarget(
    prometheus.target(
      'sum(rate(http_requests_total[5m]))',
      legendFormat='{{method}} {{path}}',
    )
  ),
  gridPos={ h: 8, w: 12, x: 0, y: 0 },
)
\`\`\`

## Organisation des dashboards

### Hiérarchie recommandée

\`\`\`
Dossiers Grafana/
├── Overview/
│   └── Platform Overview (vue haute, SRE)
├── Applications/
│   ├── API Gateway
│   ├── Service Utilisateurs
│   └── Service Paiements
├── Infrastructure/
│   ├── Nodes
│   ├── Kubernetes
│   └── Base de données
└── Business/
    ├── KPI Temps réel
    └── Conversions
\`\`\`

### Drill-down pattern

\`\`\`
Niveau 1: Vue globale (tous les services)
    │
    ▼ Clic sur un service
Niveau 2: Détails du service (endpoints, instances)
    │
    ▼ Clic sur une instance
Niveau 3: Instance spécifique (métriques détaillées, logs)
\`\`\`

## Exercices

1. **Exercice 1** : Créez un dashboard provisionné avec datasource et panels en JSON
2. **Exercice 2** : Ajoutez des annotations automatiques de déploiement depuis votre pipeline CI/CD
3. **Exercice 3** : Implémentez un pattern drill-down avec 3 niveaux de dashboards liés par des variables
`;
