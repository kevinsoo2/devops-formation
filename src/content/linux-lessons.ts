export const linuxScripting = `# Scripting Bash

## Introduction

Le scripting Bash est une compétence essentielle pour tout administrateur système et ingénieur DevOps. Il permet d'automatiser des tâches répétitives, de gérer des configurations et d'orchestrer des processus.

## Variables

### Déclaration et utilisation

\`\`\`bash
#!/bin/bash

# Variables simples
NOM="DevOps"
VERSION=3
CHEMIN="/opt/application"

# Utilisation
echo "Bienvenue dans $NOM version $VERSION"
echo "Installation dans : \${CHEMIN}/bin"

# Variables en lecture seule
readonly BASE_DIR="/etc/myapp"

# Variables d'environnement
export APP_ENV="production"
export APP_PORT=8080

# Résultat d'une commande
DATE_ACTUELLE=$(date +%Y-%m-%d)
HOSTNAME=$(hostname -f)
NB_CPUS=$(nproc)

echo "Date : $DATE_ACTUELLE, Hôte : $HOSTNAME, CPUs : $NB_CPUS"
\`\`\`

### Variables spéciales

| Variable | Signification |
|----------|---------------|
| \`$0\` | Nom du script |
| \`$1, $2...\` | Arguments positionnels |
| \`$#\` | Nombre d'arguments |
| \`$@\` | Tous les arguments (séparés) |
| \`$*\` | Tous les arguments (un seul mot) |
| \`$?\` | Code de retour de la dernière commande |
| \`$$\` | PID du script en cours |
| \`$!\` | PID du dernier processus en arrière-plan |

\`\`\`bash
#!/bin/bash
echo "Script : $0"
echo "Premier argument : $1"
echo "Nombre d'arguments : $#"
echo "Tous les arguments : $@"
\`\`\`

## Conditions (if/else/case)

### Syntaxe if/else

\`\`\`bash
#!/bin/bash

# Comparaison de chaînes
if [ "$USER" = "root" ]; then
    echo "Vous êtes root"
elif [ "$USER" = "admin" ]; then
    echo "Vous êtes admin"
else
    echo "Utilisateur standard : $USER"
fi

# Comparaison numérique
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "ALERTE : Disque presque plein ($DISK_USAGE%)"
elif [ "$DISK_USAGE" -gt 70 ]; then
    echo "ATTENTION : Disque à $DISK_USAGE%"
else
    echo "OK : Disque à $DISK_USAGE%"
fi

# Tests sur les fichiers
FICHIER="/etc/nginx/nginx.conf"
if [ -f "$FICHIER" ]; then
    echo "Le fichier existe"
elif [ -d "$FICHIER" ]; then
    echo "C'est un répertoire"
else
    echo "N'existe pas"
fi

# Double crochet (fonctionnalités avancées)
if [[ "$NOM" == Dev* && -n "$VERSION" ]]; then
    echo "Commence par Dev et VERSION est définie"
fi
\`\`\`

### Opérateurs de test

| Opérateur | Type | Description |
|-----------|------|-------------|
| -eq, -ne | Numérique | Égal, Non égal |
| -gt, -lt | Numérique | Plus grand, Plus petit |
| -ge, -le | Numérique | Plus grand ou égal, Plus petit ou égal |
| =, != | Chaîne | Égal, Non égal |
| -z | Chaîne | Vide |
| -n | Chaîne | Non vide |
| -f | Fichier | Existe et est un fichier |
| -d | Fichier | Existe et est un répertoire |
| -r, -w, -x | Fichier | Lisible, Écrivable, Exécutable |
| -s | Fichier | Existe et non vide |

### Syntaxe case

\`\`\`bash
#!/bin/bash

case "$1" in
    start)
        echo "Démarrage du service..."
        systemctl start myapp
        ;;
    stop)
        echo "Arrêt du service..."
        systemctl stop myapp
        ;;
    restart)
        echo "Redémarrage..."
        systemctl restart myapp
        ;;
    status)
        systemctl status myapp
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
\`\`\`

## Boucles (for/while)

### Boucle for

\`\`\`bash
#!/bin/bash

# Itérer sur une liste
for serveur in web01 web02 web03 db01; do
    echo "Vérification de $serveur..."
    ping -c 1 "$serveur" &>/dev/null && echo "  OK" || echo "  ÉCHEC"
done

# Itérer sur des fichiers
for fichier in /var/log/*.log; do
    taille=$(du -h "$fichier" | cut -f1)
    echo "$fichier : $taille"
done

# Boucle C-style
for ((i=1; i<=10; i++)); do
    echo "Itération $i"
done

# Itérer sur la sortie d'une commande
for user in $(cut -d: -f1 /etc/passwd); do
    echo "Utilisateur : $user"
done
\`\`\`

### Boucle while

\`\`\`bash
#!/bin/bash

# Attendre qu'un service soit prêt
ATTEMPTS=0
MAX_ATTEMPTS=30
while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "Service prêt après $ATTEMPTS tentatives"
        break
    fi
    ATTEMPTS=$((ATTEMPTS + 1))
    echo "Tentative $ATTEMPTS/$MAX_ATTEMPTS..."
    sleep 2
done

if [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; then
    echo "ERREUR : Le service n'a pas démarré"
    exit 1
fi

# Lire un fichier ligne par ligne
while IFS= read -r ligne; do
    echo "Traitement : $ligne"
done < /etc/hosts
\`\`\`

## Fonctions

\`\`\`bash
#!/bin/bash

# Déclaration de fonction
log() {
    local niveau="$1"
    local message="$2"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$niveau] $message"
}

# Fonction avec valeur de retour
verifier_service() {
    local service="$1"
    if systemctl is-active --quiet "$service"; then
        return 0  # succès
    else
        return 1  # échec
    fi
}

# Fonction avec sortie capturée
obtenir_ip() {
    local interface="\${1:-eth0}"
    ip addr show "$interface" | grep 'inet ' | awk '{print $2}' | cut -d/ -f1
}

# Utilisation
log "INFO" "Début du script"
IP=$(obtenir_ip eth0)
log "INFO" "Adresse IP : $IP"

if verifier_service nginx; then
    log "INFO" "Nginx est actif"
else
    log "ERREUR" "Nginx est inactif"
    exit 1
fi
\`\`\`

## Codes de sortie (Exit Codes)

\`\`\`bash
#!/bin/bash

# Codes de sortie conventionnels
# 0 : Succès
# 1 : Erreur générale
# 2 : Mauvaise utilisation de commande
# 126 : Permission refusée
# 127 : Commande non trouvée
# 130 : Interrompu par Ctrl+C

# Gestion d'erreurs
set -e          # Arrêter en cas d'erreur
set -u          # Erreur sur variable non définie
set -o pipefail # Erreur dans les pipes
set -x          # Mode debug (afficher les commandes)

# Trap pour nettoyage
cleanup() {
    echo "Nettoyage..."
    rm -f /tmp/mon_fichier_temp
}
trap cleanup EXIT
trap 'echo "Interrompu!"; exit 130' INT TERM

# Vérification explicite des codes de retour
if ! cp source.txt dest.txt; then
    echo "Erreur lors de la copie" >&2
    exit 1
fi

echo "Script terminé avec succès"
exit 0
\`\`\`

## Exercices

1. Écrivez un script qui accepte un nom de répertoire en argument et affiche le nombre de fichiers qu'il contient
2. Créez un script de surveillance qui vérifie l'espace disque et envoie une alerte si > 80%
3. Écrivez un script avec un menu interactif (case) pour gérer un service (start/stop/restart/status)
4. Créez une fonction de logging réutilisable avec niveaux (INFO, WARN, ERROR) et rotation
5. Écrivez un script de déploiement qui vérifie les prérequis, sauvegarde, déploie et fait un rollback en cas d'erreur
`;


export const linuxTextProcessing = `# Traitement de texte sous Linux

## Introduction

Linux dispose d'un écosystème riche d'outils de traitement de texte. Combinés avec les pipes, ils forment une chaîne de traitement puissante et flexible.

## grep - Recherche de motifs

\`\`\`bash
# Recherche basique
grep "erreur" /var/log/syslog
grep -i "error" /var/log/syslog    # Insensible à la casse

# Expressions régulières
grep -E "^[0-9]{4}-" fichier.log    # Lignes commençant par une date
grep -P "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" access.log  # Adresses IP

# Options utiles
grep -r "TODO" ./src/               # Recherche récursive
grep -n "function" script.sh        # Numéros de ligne
grep -c "ERROR" app.log             # Compter les occurrences
grep -l "password" /etc/*           # Lister les fichiers correspondants
grep -v "^#" config.conf            # Exclure les commentaires
grep -A 3 "CRITICAL" app.log       # 3 lignes après le match
grep -B 2 "CRITICAL" app.log       # 2 lignes avant le match
grep -C 2 "CRITICAL" app.log       # 2 lignes avant et après

# Combinaisons pratiques
grep -rn --include="*.py" "import os" ./   # Chercher dans les fichiers Python
grep -E "(ERROR|CRITICAL|FATAL)" app.log   # Plusieurs motifs
\`\`\`

## sed - Éditeur de flux

\`\`\`bash
# Substitution
sed 's/ancien/nouveau/' fichier          # Première occurrence par ligne
sed 's/ancien/nouveau/g' fichier         # Toutes les occurrences
sed -i 's/ancien/nouveau/g' fichier      # Modification in-place
sed -i.bak 's/ancien/nouveau/g' fichier  # Avec sauvegarde

# Suppression de lignes
sed '/^$/d' fichier                 # Supprimer les lignes vides
sed '/^#/d' config.conf             # Supprimer les commentaires
sed '1,5d' fichier                  # Supprimer les 5 premières lignes
sed '/pattern/d' fichier            # Supprimer les lignes avec pattern

# Insertion et ajout
sed '3i\\Nouvelle ligne' fichier     # Insérer avant la ligne 3
sed '3a\\Nouvelle ligne' fichier     # Ajouter après la ligne 3
sed '/^server/a\\    listen 443;' nginx.conf  # Ajouter après un motif

# Cas pratiques DevOps
sed -i "s/VERSION=.*/VERSION=$NEW_VERSION/" .env
sed -i "s|image: .*|image: registry.io/app:v2.0|" deployment.yaml
sed -n '/BEGIN/,/END/p' fichier     # Extraire un bloc
\`\`\`

## awk - Traitement structuré

\`\`\`bash
# Afficher des colonnes spécifiques
awk '{print $1, $3}' fichier              # Colonnes 1 et 3
awk -F: '{print $1, $7}' /etc/passwd      # Séparateur personnalisé
awk -F',' '{print $2}' data.csv           # Fichier CSV

# Filtrage conditionnel
awk '$3 > 1000 {print $1, $3}' fichier    # Colonne 3 > 1000
awk '/ERROR/ {print $0}' app.log          # Lignes avec ERROR
awk 'NR>=10 && NR<=20' fichier            # Lignes 10 à 20

# Calculs et agrégations
awk '{sum += $3} END {print "Total:", sum}' fichier
awk '{sum += $3; count++} END {print "Moyenne:", sum/count}' fichier

# Formatage avancé
awk 'BEGIN {printf "%-20s %10s\\n", "NOM", "TAILLE"}
     {printf "%-20s %10d\\n", $1, $5}' <<< "$(ls -l)"

# Cas pratiques
# Analyser les logs d'accès Apache/Nginx
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Mémoire par processus
ps aux | awk 'NR>1 {print $4, $11}' | sort -rn | head -10

# Calculer la bande passante
awk '{total += $10} END {printf "Total: %.2f GB\\n", total/1024/1024/1024}' access.log
\`\`\`

## cut - Découpage de champs

\`\`\`bash
# Par caractères
cut -c1-10 fichier                  # 10 premiers caractères
cut -c5- fichier                    # À partir du 5e caractère

# Par délimiteur
cut -d: -f1 /etc/passwd             # Premier champ (séparateur :)
cut -d',' -f2,4 data.csv            # Champs 2 et 4 d'un CSV
cut -d' ' -f1,4 access.log         # IP et status code
\`\`\`

## sort - Tri

\`\`\`bash
# Tri basique
sort fichier                        # Alphabétique
sort -n fichier                     # Numérique
sort -r fichier                     # Inversé
sort -u fichier                     # Supprimer les doublons

# Tri par champ
sort -t: -k3 -n /etc/passwd         # Par UID (3e champ)
sort -t',' -k2 -n data.csv          # 2e colonne d'un CSV

# Tri complexe
du -sh /var/log/* | sort -h         # Par taille humaine
sort -t. -k1,1n -k2,2n -k3,3n -k4,4n ips.txt  # Tri d'IPs
\`\`\`

## uniq - Dédoublonnage

\`\`\`bash
# Basique (requiert un tri préalable)
sort fichier | uniq                  # Supprimer les doublons
sort fichier | uniq -c               # Compter les occurrences
sort fichier | uniq -d               # Afficher seulement les doublons
sort fichier | uniq -u               # Afficher seulement les uniques

# Cas pratique : top des IPs dans les logs
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20
\`\`\`

## tr - Transformation de caractères

\`\`\`bash
# Remplacement
echo "hello" | tr 'a-z' 'A-Z'           # Majuscules
echo "hello" | tr '[:lower:]' '[:upper:]' # Idem
cat fichier | tr '\\t' ','                # Tab vers virgule

# Suppression
echo "Hello 123 World" | tr -d '0-9'     # Supprimer les chiffres
echo "  espaces  " | tr -d ' '           # Supprimer les espaces
cat fichier | tr -d '\\r'                 # Supprimer les retours Windows

# Compression
echo "aaa   bbb" | tr -s ' '             # Réduire les espaces multiples
\`\`\`

## xargs - Construction de commandes

\`\`\`bash
# Utilisation basique
find /tmp -name "*.tmp" | xargs rm -f
cat urls.txt | xargs -I {} curl -s {}

# Parallélisme
find . -name "*.jpg" | xargs -P 4 -I {} convert {} -resize 50% {}

# Avec confirmation
find /var/log -name "*.gz" -mtime +30 | xargs -p rm -f

# Combinaison pratique
docker ps -q | xargs docker stop         # Arrêter tous les conteneurs
grep -rl "old_config" . | xargs sed -i 's/old_config/new_config/g'
\`\`\`

## Pipes - Chaîner les commandes

\`\`\`bash
# Analyse de logs complexe
cat access.log | \\
  grep "POST /api" | \\
  awk '{print $1, $9}' | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  head -10

# Trouver les plus gros fichiers
find / -type f -size +100M 2>/dev/null | \\
  xargs ls -lh | \\
  awk '{print $5, $9}' | \\
  sort -rh | \\
  head -20

# Surveillance en temps réel
tail -f /var/log/nginx/access.log | \\
  grep --line-buffered "500" | \\
  awk '{print strftime("%H:%M:%S"), $1, $7}'
\`\`\`

## Tableau récapitulatif

| Outil | Cas d'usage principal |
|-------|----------------------|
| grep | Filtrer des lignes par motif |
| sed | Remplacer/transformer du texte |
| awk | Traiter des données structurées en colonnes |
| cut | Extraire des champs spécifiques |
| sort | Trier des lignes |
| uniq | Dédoublonner (après tri) |
| tr | Transformer/supprimer des caractères |
| xargs | Construire des commandes à partir de stdin |

## Exercices

1. Extrayez les 10 adresses IP les plus fréquentes d'un fichier access.log
2. Remplacez toutes les occurrences d'une URL dans un ensemble de fichiers YAML
3. Calculez la taille totale des réponses HTTP 200 dans un log d'accès avec awk
4. Créez un one-liner qui trouve et supprime les fichiers de plus de 30 jours dans /tmp
5. Écrivez un pipeline qui analyse un fichier CSV et produit un résumé statistique
`;


export const linuxProcesses = `# Gestion des processus Linux

## Introduction

La gestion des processus est fondamentale pour l'administration système. Un processus est une instance d'un programme en cours d'exécution, avec son propre espace mémoire, ses descripteurs de fichiers et son état.

## ps - Liste des processus

\`\`\`bash
# Affichages courants
ps aux                              # Tous les processus (format BSD)
ps -ef                              # Tous les processus (format POSIX)
ps -u www-data                      # Processus d'un utilisateur
ps -p 1234                          # Un processus spécifique

# Colonnes utiles
ps aux --sort=-%mem | head -20      # Top consommateurs mémoire
ps aux --sort=-%cpu | head -20      # Top consommateurs CPU

# Format personnalisé
ps -eo pid,ppid,user,%mem,%cpu,stat,start,time,command --sort=-%mem | head -20

# Arbre des processus
ps auxf                             # Affichage hiérarchique
pstree -p                           # Arbre avec PIDs
pstree -u www-data                  # Arbre d'un utilisateur
\`\`\`

### États des processus

| État | Code | Description |
|------|------|-------------|
| Running | R | En cours d'exécution |
| Sleeping | S | En attente d'un événement |
| Disk sleep | D | En attente d'E/S disque (non interruptible) |
| Stopped | T | Arrêté (par un signal) |
| Zombie | Z | Terminé mais non récupéré par le parent |

## top / htop - Surveillance en temps réel

### top

\`\`\`bash
# Lancer top
top

# Raccourcis dans top
# M : Trier par mémoire
# P : Trier par CPU
# k : Tuer un processus
# 1 : Afficher chaque CPU
# c : Afficher la commande complète
# q : Quitter

# Mode batch (pour scripts)
top -bn1 | head -20                 # Un seul snapshot
top -bn5 -d2 | grep "Cpu"          # 5 snapshots toutes les 2s
\`\`\`

### htop

\`\`\`bash
# Installation
sudo apt install htop    # Debian/Ubuntu
sudo dnf install htop    # RHEL/Fedora

# Lancer htop
htop

# Fonctionnalités de htop vs top
# - Interface colorée et intuitive
# - Scroll horizontal et vertical
# - Filtrage par processus (F4)
# - Recherche (F3)
# - Arbre des processus (F5)
# - Configuration des colonnes (F2)
# - Envoi de signaux (F9)
\`\`\`

## kill - Envoyer des signaux

### Signaux principaux

| Signal | Numéro | Action | Description |
|--------|--------|--------|-------------|
| SIGHUP | 1 | Recharger | Recharger la configuration |
| SIGINT | 2 | Interrompre | Ctrl+C |
| SIGQUIT | 3 | Quitter | Avec core dump |
| SIGKILL | 9 | Tuer | Non interceptable |
| SIGTERM | 15 | Terminer | Arrêt propre (défaut) |
| SIGSTOP | 19 | Suspendre | Non interceptable |
| SIGCONT | 18 | Continuer | Reprendre un processus |

\`\`\`bash
# Envoyer des signaux
kill 1234                           # SIGTERM (arrêt propre)
kill -9 1234                        # SIGKILL (forcé)
kill -HUP 1234                      # Recharger la config
kill -STOP 1234                     # Suspendre
kill -CONT 1234                     # Reprendre

# Tuer par nom
killall nginx                       # Tous les processus nginx
pkill -f "python app.py"            # Par motif de commande
pkill -u www-data                   # Par utilisateur

# Tuer un groupe de processus
kill -TERM -$(ps -o pgid= -p 1234 | tr -d ' ')
\`\`\`

## nice / renice - Priorité des processus

\`\`\`bash
# Lancer avec une priorité basse (nice value: -20 à +19)
nice -n 10 ./traitement_lourd.sh     # Priorité basse
nice -n -5 ./tache_importante.sh     # Priorité haute (nécessite root)

# Modifier la priorité d'un processus en cours
renice 10 -p 1234                    # Baisser la priorité
renice -5 -p 1234                    # Augmenter (root requis)
renice 15 -u www-data                # Tous les processus d'un utilisateur

# Vérifier la priorité
ps -eo pid,ni,comm | grep nginx
\`\`\`

## nohup - Processus détachés

\`\`\`bash
# Lancer un processus qui survit à la déconnexion
nohup ./script_long.sh &
nohup ./script_long.sh > output.log 2>&1 &

# Alternative avec disown
./script_long.sh &
disown %1

# Screen et tmux pour les sessions persistantes
# Screen
screen -S ma-session
# (exécuter des commandes)
# Ctrl+A, D pour détacher
screen -r ma-session                 # Se rattacher

# Tmux
tmux new -s deploiement
# (exécuter des commandes)
# Ctrl+B, D pour détacher
tmux attach -t deploiement           # Se rattacher
\`\`\`

## Jobs - Gestion des tâches en arrière-plan

\`\`\`bash
# Lancer en arrière-plan
./backup.sh &

# Gérer les jobs
jobs                                 # Lister les jobs
jobs -l                              # Avec les PIDs

# Contrôle des jobs
# Ctrl+Z : Suspendre le processus au premier plan
bg %1                                # Reprendre en arrière-plan
fg %1                                # Remettre au premier plan

# Attendre la fin d'un job
wait %1                              # Attendre le job 1
wait                                 # Attendre tous les jobs

# Exemple pratique
for serveur in web01 web02 web03; do
    ssh "$serveur" "sudo apt update && sudo apt upgrade -y" &
done
wait
echo "Mise à jour terminée sur tous les serveurs"
\`\`\`

## systemd - Gestion des services

### Commandes de base

\`\`\`bash
# Gestion des services
systemctl start nginx                # Démarrer
systemctl stop nginx                 # Arrêter
systemctl restart nginx              # Redémarrer
systemctl reload nginx               # Recharger la config
systemctl status nginx               # Statut détaillé
systemctl enable nginx               # Activer au démarrage
systemctl disable nginx              # Désactiver au démarrage
systemctl is-active nginx            # Vérifier si actif
systemctl is-enabled nginx           # Vérifier si activé

# Lister les services
systemctl list-units --type=service              # Services actifs
systemctl list-units --type=service --all        # Tous les services
systemctl list-unit-files --type=service         # Fichiers d'unité
systemctl list-units --state=failed              # Services en erreur
\`\`\`

### Créer un service personnalisé

\`\`\`ini
# /etc/systemd/system/mon-app.service
[Unit]
Description=Mon Application Web
Documentation=https://docs.example.com
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=appuser
Group=appgroup
WorkingDirectory=/opt/mon-app
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStartPre=/opt/mon-app/scripts/pre-start.sh
ExecStart=/usr/bin/node /opt/mon-app/server.js
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mon-app

# Sécurité
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/mon-app/data

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
# Activer le nouveau service
sudo systemctl daemon-reload
sudo systemctl enable --now mon-app
sudo systemctl status mon-app

# Consulter les logs
journalctl -u mon-app -f             # Suivre en temps réel
journalctl -u mon-app --since today  # Depuis aujourd'hui
\`\`\`

## Exercices

1. Identifiez les 5 processus consommant le plus de mémoire et CPU sur votre système
2. Créez un script qui surveille un processus et le redémarre s'il s'arrête
3. Écrivez un fichier de service systemd pour une application Node.js avec redémarrage automatique
4. Utilisez nice pour lancer un script de compression avec une priorité basse
5. Mettez en place une session tmux avec plusieurs fenêtres pour surveiller un déploiement
`;


export const linuxCron = `# Planification de tâches sous Linux

## Introduction

La planification de tâches permet d'automatiser l'exécution de scripts et commandes à des moments précis ou à intervalles réguliers. C'est essentiel pour les sauvegardes, la maintenance et la surveillance.

## Syntaxe Cron

### Format de la crontab

\`\`\`
┌───────────── minute (0-59)
│ ┌───────────── heure (0-23)
│ │ ┌───────────── jour du mois (1-31)
│ │ │ ┌───────────── mois (1-12)
│ │ │ │ ┌───────────── jour de la semaine (0-7, 0 et 7 = dimanche)
│ │ │ │ │
* * * * * commande à exécuter
\`\`\`

### Caractères spéciaux

| Caractère | Signification | Exemple |
|-----------|---------------|---------|
| * | Toutes les valeurs | * (chaque minute) |
| , | Liste de valeurs | 1,15,30 |
| - | Plage de valeurs | 1-5 (lundi à vendredi) |
| / | Intervalle | */5 (toutes les 5 minutes) |

### Exemples de planification

\`\`\`bash
# Toutes les 5 minutes
*/5 * * * * /scripts/check_health.sh

# Tous les jours à 2h30
30 2 * * * /scripts/backup.sh

# Chaque lundi à 8h00
0 8 * * 1 /scripts/rapport_hebdo.sh

# Le 1er de chaque mois à minuit
0 0 1 * * /scripts/nettoyage_mensuel.sh

# Du lundi au vendredi à 9h et 18h
0 9,18 * * 1-5 /scripts/notification.sh

# Toutes les 15 minutes pendant les heures de bureau
*/15 8-18 * * 1-5 /scripts/monitoring.sh

# Tous les dimanches à 3h00
0 3 * * 0 /scripts/maintenance.sh
\`\`\`

### Raccourcis temporels

| Raccourci | Équivalent | Description |
|-----------|-----------|-------------|
| @reboot | - | Au démarrage |
| @yearly | 0 0 1 1 * | Une fois par an |
| @monthly | 0 0 1 * * | Une fois par mois |
| @weekly | 0 0 * * 0 | Une fois par semaine |
| @daily | 0 0 * * * | Une fois par jour |
| @hourly | 0 * * * * | Une fois par heure |

## crontab - Gestion des tâches

\`\`\`bash
# Éditer la crontab de l'utilisateur courant
crontab -e

# Lister les tâches cron
crontab -l

# Supprimer toutes les tâches
crontab -r

# Gérer la crontab d'un autre utilisateur (root)
sudo crontab -u www-data -e
sudo crontab -u www-data -l

# Crontab système
sudo vim /etc/crontab
\`\`\`

### Bonnes pratiques pour les scripts cron

\`\`\`bash
#!/bin/bash
# /scripts/backup.sh - Script de sauvegarde exécuté par cron

# Toujours utiliser des chemins absolus
PATH=/usr/local/bin:/usr/bin:/bin

# Rediriger les sorties vers un fichier de log
LOGFILE="/var/log/backup_$(date +%Y%m%d).log"
exec >> "$LOGFILE" 2>&1

echo "=== Début de la sauvegarde : $(date) ==="

# Verrouillage pour éviter les exécutions parallèles
LOCKFILE="/var/run/backup.lock"
if [ -f "$LOCKFILE" ]; then
    echo "ERREUR: Sauvegarde déjà en cours (PID: $(cat $LOCKFILE))"
    exit 1
fi
echo $$ > "$LOCKFILE"
trap "rm -f $LOCKFILE" EXIT

# Exécuter la sauvegarde
/usr/bin/rsync -avz /data/ /backup/data_$(date +%Y%m%d)/

echo "=== Fin de la sauvegarde : $(date) ==="
\`\`\`

### Fichier crontab avec environnement

\`\`\`bash
# Variables d'environnement
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=admin@example.com
HOME=/root

# Tâches
0 2 * * * /scripts/backup.sh
*/10 * * * * /scripts/health_check.sh > /dev/null 2>&1
0 6 * * 1 /scripts/rapport.sh | mail -s "Rapport hebdo" admin@example.com
\`\`\`

## systemd Timers

Les timers systemd sont l'alternative moderne aux cron jobs avec plus de fonctionnalités.

### Créer un timer

\`\`\`ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Sauvegarde quotidienne

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
\`\`\`

\`\`\`ini
# /etc/systemd/system/backup.service
[Unit]
Description=Service de sauvegarde
After=network-online.target

[Service]
Type=oneshot
User=backup
ExecStart=/scripts/backup.sh
StandardOutput=journal
StandardError=journal
\`\`\`

### Gestion des timers

\`\`\`bash
# Activer et démarrer le timer
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer

# Vérifier les timers actifs
systemctl list-timers --all

# Statut d'un timer
systemctl status backup.timer

# Exécuter manuellement le service associé
sudo systemctl start backup.service

# Logs du service
journalctl -u backup.service
\`\`\`

### Syntaxe OnCalendar

\`\`\`bash
# Format : DayOfWeek Year-Month-Day Hour:Minute:Second
OnCalendar=*-*-* 02:30:00           # Chaque jour à 2h30
OnCalendar=Mon *-*-* 08:00:00       # Chaque lundi à 8h
OnCalendar=*-*-01 00:00:00          # Le 1er de chaque mois
OnCalendar=*-01,07-01 00:00:00      # 1er janvier et 1er juillet

# Intervalles
OnBootSec=5min                       # 5 minutes après le démarrage
OnUnitActiveSec=1h                   # 1 heure après la dernière exécution

# Vérifier la syntaxe
systemd-analyze calendar "*-*-* 02:30:00"
systemd-analyze calendar "Mon *-*-* 08:00:00" --iterations=5
\`\`\`

### Comparaison cron vs systemd timers

| Critère | cron | systemd timer |
|---------|------|---------------|
| Configuration | Simple (une ligne) | Deux fichiers (timer + service) |
| Logs | Syslog ou fichier | journalctl intégré |
| Dépendances | Non | Oui (After=, Requires=) |
| Rattrapage | Non (anacron) | Persistent=true |
| Précision | Minute | Seconde |
| Aléatoire | Non | RandomizedDelaySec |
| Monitoring | Difficile | systemctl status |
| Sécurité | Limité | Sandboxing complet |

## at - Exécution ponctuelle

\`\`\`bash
# Exécuter une commande à un moment précis
echo "/scripts/migration.sh" | at 02:00
at 14:30 <<< "/scripts/task.sh"

# Planifier pour une date spécifique
at 10:00 AM Dec 25 <<EOF
/scripts/notification_noel.sh
EOF

# En relatif
at now + 30 minutes <<< "/scripts/rappel.sh"
at now + 2 hours <<< "/scripts/check.sh"
at now + 1 day <<< "/scripts/demain.sh"

# Gestion des tâches at
atq                                  # Lister les tâches planifiées
at -c 5                              # Voir le contenu de la tâche 5
atrm 5                               # Supprimer la tâche 5
\`\`\`

## anacron - Tâches pour machines non permanentes

Anacron est conçu pour les machines qui ne sont pas allumées en permanence. Il garantit que les tâches sont exécutées même après un arrêt.

\`\`\`bash
# /etc/anacrontab
# période  délai  identifiant  commande
1          5      backup-daily    /scripts/backup.sh
7          10     cleanup-weekly  /scripts/cleanup.sh
30         15     report-monthly  /scripts/rapport.sh
@monthly   20     big-cleanup     /scripts/nettoyage_complet.sh
\`\`\`

\`\`\`bash
# Forcer l'exécution de toutes les tâches
sudo anacron -f

# Mode test (affiche sans exécuter)
sudo anacron -T

# Vérifier les timestamps
ls -la /var/spool/anacron/
\`\`\`

## Exercices

1. Créez une crontab qui effectue une sauvegarde incrémentale toutes les 6 heures
2. Mettez en place un timer systemd pour un nettoyage hebdomadaire avec logging
3. Écrivez un script cron avec verrouillage, logging et notification par email en cas d'erreur
4. Configurez anacron pour une tâche mensuelle de rotation des logs
5. Convertissez 3 cron jobs existants en timers systemd avec leurs services associés
`;


export const linuxPerformance = `# Optimisation des performances Linux

## Introduction

L'optimisation des performances est un processus itératif : identifier le goulot d'étranglement, mesurer, ajuster et vérifier. Les outils Linux permettent d'observer chaque couche du système (CPU, mémoire, disque, réseau).

## vmstat - Statistiques système

\`\`\`bash
# Affichage continu (toutes les 2 secondes, 10 fois)
vmstat 2 10

# Sortie type :
# procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
#  r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
#  1  0      0 2048000 128000 512000    0    0     5    10  200  400 10  3 85  2  0
\`\`\`

### Interprétation des colonnes

| Colonne | Section | Signification |
|---------|---------|---------------|
| r | procs | Processus en attente de CPU |
| b | procs | Processus bloqués (I/O) |
| swpd | memory | Mémoire swap utilisée |
| free | memory | Mémoire libre |
| si/so | swap | Swap in/out (doit être ~0) |
| bi/bo | io | Blocs lus/écrits par seconde |
| us | cpu | % CPU utilisateur |
| sy | cpu | % CPU système (kernel) |
| id | cpu | % CPU inactif |
| wa | cpu | % CPU en attente I/O |

\`\`\`bash
# Alertes à surveiller :
# r > nombre de CPUs : surcharge CPU
# b > 0 prolongé : goulet I/O
# si/so > 0 : problème de mémoire (swap actif)
# wa > 20% : problème de disque

# Mode étendu
vmstat -s                            # Statistiques résumées
vmstat -d                            # Statistiques disque
vmstat -p /dev/sda1                  # Partition spécifique
\`\`\`

## iostat - Performances I/O

\`\`\`bash
# Installation
sudo apt install sysstat    # Debian/Ubuntu
sudo dnf install sysstat    # RHEL/Fedora

# Utilisation basique
iostat -x 2 5               # Mode étendu, toutes les 2s, 5 fois

# Sortie type :
# Device  r/s  w/s  rkB/s  wkB/s  rrqm/s  wrqm/s  %util  await
# sda     50   120  2000   4800   10      30       65     8.5

# Par disque
iostat -xp /dev/sda 1       # Partition sda, chaque seconde
\`\`\`

### Métriques clés I/O

| Métrique | Seuil d'alerte | Signification |
|----------|---------------|---------------|
| %util | > 80% | Disque saturé |
| await | > 20ms (SSD), > 50ms (HDD) | Latence élevée |
| r/s + w/s | Dépend du disque | IOPS |
| avgqu-sz | > 1 | File d'attente saturée |

## sar - Historique système (System Activity Reporter)

\`\`\`bash
# Activer la collecte automatique
sudo systemctl enable --now sysstat

# CPU
sar -u 2 10                          # Utilisation CPU
sar -u -f /var/log/sysstat/sa01      # Données historiques du 1er

# Mémoire
sar -r 2 5                           # Utilisation mémoire

# Réseau
sar -n DEV 2 5                       # Interfaces réseau
sar -n TCP 2 5                       # Statistiques TCP

# Disque
sar -d 2 5                           # Activité disque

# File d'attente
sar -q 2 5                           # Load average et file d'exécution

# Historique d'une journée passée
sar -u -f /var/log/sysstat/sa15      # CPU du 15 du mois
sar -r -s 08:00:00 -e 18:00:00      # Mémoire entre 8h et 18h
\`\`\`

## strace - Traçage des appels système

\`\`\`bash
# Tracer un processus existant
strace -p 1234

# Tracer l'exécution d'une commande
strace ls /tmp

# Options utiles
strace -c ls /tmp                    # Résumé statistique
strace -e trace=open,read,write ls   # Filtrer les appels
strace -e trace=network curl http://example.com  # Appels réseau
strace -t -p 1234                    # Avec horodatage
strace -f -p 1234                    # Suivre les forks (sous-processus)
strace -o trace.log ./mon_app        # Sauvegarder dans un fichier

# Cas pratiques
# Pourquoi un programme est lent ?
strace -c -p $(pgrep mon-app) -e trace=file
# Quels fichiers sont ouverts ?
strace -e trace=open,openat ./mon_app 2>&1 | grep -v ENOENT
\`\`\`

## lsof - Fichiers et connexions ouverts

\`\`\`bash
# Fichiers ouverts par un processus
lsof -p 1234

# Qui utilise un fichier ?
lsof /var/log/syslog

# Connexions réseau
lsof -i                              # Toutes les connexions
lsof -i :80                          # Port 80
lsof -i TCP:443                      # TCP sur le port 443
lsof -i @192.168.1.100              # Connexions vers une IP

# Fichiers supprimés mais encore ouverts (espace non libéré)
lsof +L1

# Par utilisateur
lsof -u www-data

# Fichiers ouverts dans un répertoire
lsof +D /var/log/

# Compter les fichiers ouverts par processus
lsof | awk '{print $2}' | sort | uniq -c | sort -rn | head -10
\`\`\`

## Tuning des paramètres kernel

### Paramètres réseau

\`\`\`bash
# Voir les paramètres actuels
sysctl -a | grep net

# Optimisations réseau pour serveurs chargés
cat >> /etc/sysctl.d/99-performance.conf << EOF
# Augmenter les buffers réseau
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# Augmenter la file d'attente des connexions
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535

# Réutiliser les connexions TIME_WAIT
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# Keepalive
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
EOF

# Appliquer
sudo sysctl -p /etc/sysctl.d/99-performance.conf
\`\`\`

### Paramètres mémoire

\`\`\`bash
# Gestion du swap
cat >> /etc/sysctl.d/99-performance.conf << EOF
# Réduire l'utilisation du swap (0-100, défaut 60)
vm.swappiness = 10

# Cache pressure (défaut 100)
vm.vfs_cache_pressure = 50

# Dirty pages (écriture disque)
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF
\`\`\`

### Limites système

\`\`\`bash
# Voir les limites du processus courant
ulimit -a

# Augmenter les limites pour un service
# /etc/security/limits.d/99-app.conf
cat > /etc/security/limits.d/99-app.conf << EOF
www-data soft nofile 65535
www-data hard nofile 65535
www-data soft nproc 4096
www-data hard nproc 4096
EOF

# Pour systemd
# Dans le fichier service :
# [Service]
# LimitNOFILE=65535
# LimitNPROC=4096

# Vérifier les limites d'un processus
cat /proc/$(pgrep nginx | head -1)/limits
\`\`\`

### Paramètres disque

\`\`\`bash
# Scheduler I/O (SSD vs HDD)
cat /sys/block/sda/queue/scheduler

# Pour SSD (none ou mq-deadline)
echo "none" > /sys/block/sda/queue/scheduler

# Pour HDD
echo "mq-deadline" > /sys/block/sda/queue/scheduler

# Read-ahead (pour les accès séquentiels)
blockdev --getra /dev/sda
blockdev --setra 4096 /dev/sda      # Augmenter le read-ahead
\`\`\`

## Tableau récapitulatif des outils

| Outil | Focus | Quand l'utiliser |
|-------|-------|-----------------|
| vmstat | Vue globale | Premier diagnostic |
| iostat | Disques I/O | Latence ou saturation disque |
| sar | Historique | Tendances et corrélation temporelle |
| strace | Appels système | Debugging d'application |
| lsof | Fichiers/Réseau | Fuites de descripteurs, ports |
| top/htop | CPU/Mémoire | Surveillance en temps réel |

## Exercices

1. Utilisez vmstat pour identifier si votre système est limité par le CPU, la mémoire ou le disque
2. Analysez les performances I/O avec iostat et identifiez le disque le plus sollicité
3. Configurez sar pour collecter des données et générez un rapport sur 24h
4. Utilisez strace pour comprendre pourquoi une commande est lente
5. Optimisez les paramètres kernel pour un serveur web à fort trafic et mesurez l'impact
`;


export const linuxTroubleshooting = `# Dépannage et diagnostic Linux

## Introduction

Le dépannage système est une compétence critique pour un ingénieur DevOps. Cette leçon couvre les outils et méthodologies pour diagnostiquer et résoudre les problèmes courants sur les systèmes Linux.

## dmesg - Messages du noyau

\`\`\`bash
# Afficher les messages du noyau
dmesg                                # Tous les messages
dmesg -T                             # Avec horodatage lisible
dmesg --level=err,warn               # Erreurs et avertissements
dmesg -w                             # Mode suivi (comme tail -f)

# Filtrage
dmesg | grep -i "error"              # Erreurs
dmesg | grep -i "oom"               # Out of Memory
dmesg | grep -i "disk"              # Problèmes disque
dmesg | grep -E "(sda|sdb|nvme)"    # Événements disque

# Après un crash ou un problème
dmesg -T | tail -50                  # Derniers messages avec timestamp
dmesg --level=emerg,alert,crit       # Messages critiques uniquement

# Cas courants à chercher
dmesg | grep -i "killed process"     # OOM Killer
dmesg | grep -i "I/O error"         # Erreurs disque
dmesg | grep -i "link is not ready" # Problèmes réseau
\`\`\`

## journalctl - Logs systemd

\`\`\`bash
# Consultation des logs
journalctl                           # Tous les logs
journalctl -f                        # Suivi en temps réel
journalctl -b                        # Boot actuel
journalctl -b -1                     # Boot précédent
journalctl --list-boots              # Lister les boots

# Filtrage par unité
journalctl -u nginx                  # Logs d'un service
journalctl -u nginx --since today    # Depuis aujourd'hui
journalctl -u nginx -p err           # Uniquement les erreurs

# Filtrage par temps
journalctl --since "2024-01-15 10:00:00"
journalctl --since "1 hour ago"
journalctl --since "2024-01-15" --until "2024-01-16"

# Filtrage par priorité
journalctl -p 0                      # emerg
journalctl -p 3                      # err
journalctl -p err..warning           # Plage de priorités

# Format de sortie
journalctl -o json-pretty            # JSON formaté
journalctl -o short-precise          # Timestamps précis
journalctl --no-pager                # Sans pagination

# Espace utilisé par les logs
journalctl --disk-usage

# Rotation des logs
sudo journalctl --vacuum-time=7d     # Garder 7 jours
sudo journalctl --vacuum-size=1G     # Limiter à 1 Go
\`\`\`

### Niveaux de priorité

| Niveau | Code | Signification |
|--------|------|---------------|
| emerg | 0 | Système inutilisable |
| alert | 1 | Action immédiate requise |
| crit | 2 | Conditions critiques |
| err | 3 | Erreurs |
| warning | 4 | Avertissements |
| notice | 5 | Normal mais significatif |
| info | 6 | Informationnel |
| debug | 7 | Débogage |

## tcpdump - Capture réseau

\`\`\`bash
# Capture basique
sudo tcpdump -i eth0                 # Tout le trafic sur eth0
sudo tcpdump -i any                  # Toutes les interfaces

# Filtres courants
sudo tcpdump -i eth0 port 80        # Trafic HTTP
sudo tcpdump -i eth0 port 443       # Trafic HTTPS
sudo tcpdump -i eth0 host 192.168.1.100  # Trafic vers/depuis une IP
sudo tcpdump -i eth0 src 10.0.0.1   # Trafic depuis une source
sudo tcpdump -i eth0 dst port 3306  # Trafic vers MySQL

# Options utiles
sudo tcpdump -i eth0 -n             # Sans résolution DNS
sudo tcpdump -i eth0 -c 100         # Capturer 100 paquets
sudo tcpdump -i eth0 -w capture.pcap  # Sauvegarder dans un fichier
sudo tcpdump -r capture.pcap        # Lire un fichier de capture

# Filtres combinés
sudo tcpdump -i eth0 'tcp port 80 and host 10.0.0.5'
sudo tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn) != 0'  # SYN packets
sudo tcpdump -i eth0 -A 'port 80'   # Afficher le contenu ASCII

# Diagnostiquer un problème de connexion
sudo tcpdump -i eth0 -nn 'host db.example.com and port 5432'
\`\`\`

## netstat / ss - Connexions réseau

\`\`\`bash
# ss (successeur moderne de netstat)
ss -tlnp                             # Ports TCP en écoute avec processus
ss -ulnp                             # Ports UDP en écoute
ss -s                                # Statistiques résumées
ss -tnp                              # Connexions TCP établies

# Filtrage
ss -tn state established            # Connexions établies
ss -tn state time-wait              # Connexions en TIME_WAIT
ss -tn dst 10.0.0.5                 # Vers une destination
ss -tn sport = :80                  # Source port 80

# netstat (si ss non disponible)
netstat -tlnp                        # Ports en écoute
netstat -an | grep ESTABLISHED       # Connexions actives
netstat -s                           # Statistiques

# Compter les connexions par état
ss -tn | awk '{print $1}' | sort | uniq -c | sort -rn

# Compter les connexions par IP
ss -tn | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10

# Vérifier si un port est occupé
ss -tlnp | grep :8080
\`\`\`

## Problèmes de disque

### Diagnostic

\`\`\`bash
# Espace disque
df -h                                # Utilisation des partitions
df -i                                # Utilisation des inodes
du -sh /var/log/*                    # Taille des sous-répertoires
du -h --max-depth=1 / | sort -rh    # Top répertoires

# Trouver les gros fichiers
find / -type f -size +100M -exec ls -lh {} \\;
find / -type f -size +1G 2>/dev/null

# Fichiers supprimés mais encore ouverts
lsof +L1 | grep deleted

# Santé du disque
sudo smartctl -a /dev/sda            # État SMART
sudo smartctl -H /dev/sda            # Test rapide de santé

# Vérifier le système de fichiers
sudo fsck -n /dev/sda1               # Mode lecture seule
\`\`\`

### Résolution

\`\`\`bash
# Libérer de l'espace rapidement
# 1. Logs volumineux
sudo journalctl --vacuum-size=500M
sudo find /var/log -name "*.gz" -mtime +7 -delete
sudo truncate -s 0 /var/log/app/huge.log

# 2. Cache des paquets
sudo apt clean                       # Debian/Ubuntu
sudo dnf clean all                   # RHEL/Fedora

# 3. Fichiers supprimés non libérés
# Identifier les processus
lsof +L1 | grep deleted
# Redémarrer le service ou forcer la libération
sudo systemctl restart rsyslog

# 4. Problème d'inodes
df -i                                # Vérifier les inodes
# Trouver le répertoire avec beaucoup de petits fichiers
find / -xdev -printf '%h\\n' | sort | uniq -c | sort -rn | head -10
\`\`\`

## Fuites mémoire et OOM

### Diagnostic mémoire

\`\`\`bash
# Vue d'ensemble
free -h                              # Mémoire disponible
cat /proc/meminfo                    # Détails complets

# Mémoire par processus
ps aux --sort=-%mem | head -20
smem -tk                             # Mémoire réelle par processus (PSS)

# Surveiller l'évolution
watch -n 5 'free -h'
while true; do
    date >> /tmp/mem_monitor.log
    free -m >> /tmp/mem_monitor.log
    ps aux --sort=-%mem | head -5 >> /tmp/mem_monitor.log
    sleep 60
done

# Détecter l'OOM Killer
dmesg | grep -i "oom"
journalctl -k | grep -i "oom"
grep -i "killed process" /var/log/syslog
\`\`\`

### Configuration OOM

\`\`\`bash
# Protéger un processus de l'OOM Killer
echo -1000 > /proc/$(pgrep postgres)/oom_score_adj

# Rendre un processus prioritaire pour l'OOM Killer
echo 1000 > /proc/$(pgrep cache-process)/oom_score_adj

# Voir le score OOM d'un processus
cat /proc/$(pgrep nginx)/oom_score

# Dans systemd, protéger un service
# [Service]
# OOMScoreAdjust=-900
\`\`\`

## Problèmes courants et solutions

### Service qui ne démarre pas

\`\`\`bash
# 1. Vérifier le statut
systemctl status mon-service

# 2. Consulter les logs
journalctl -u mon-service -n 50 --no-pager

# 3. Vérifier la configuration
systemd-analyze verify /etc/systemd/system/mon-service.service

# 4. Tester manuellement
sudo -u appuser /opt/app/bin/start.sh

# 5. Vérifier les permissions
ls -la /opt/app/
namei -l /opt/app/data/

# 6. Vérifier les ports
ss -tlnp | grep :8080
\`\`\`

### Connexion réseau refusée

\`\`\`bash
# 1. Le service écoute-t-il ?
ss -tlnp | grep :PORT

# 2. Firewall
sudo iptables -L -n
sudo nft list ruleset
sudo ufw status verbose

# 3. Test de connectivité
ping serveur
telnet serveur 80
curl -v http://serveur:80
nc -zv serveur 80

# 4. Résolution DNS
nslookup serveur
dig serveur
host serveur

# 5. Routes
ip route get IP_DESTINATION
traceroute serveur
mtr serveur
\`\`\`

### Charge CPU élevée

\`\`\`bash
# 1. Identifier le processus
top -bn1 | head -20
ps aux --sort=-%cpu | head -10

# 2. Analyser le processus
strace -c -p PID                     # Appels système
perf top -p PID                      # Profiling CPU

# 3. Vérifier si c'est I/O wait
iostat -x 1 5
iotop                                # Top des I/O par processus

# 4. Load average vs CPU
nproc                                # Nombre de CPUs
uptime                               # Load average
# Si load > nproc = surcharge
\`\`\`

### Application qui plante

\`\`\`bash
# 1. Core dumps
ulimit -c unlimited                  # Activer les core dumps
# Vérifier l'emplacement
cat /proc/sys/kernel/core_pattern

# 2. Analyser avec gdb
gdb /usr/bin/mon-app /var/crash/core.12345
# (gdb) bt                            # Backtrace

# 3. Logs de l'application
journalctl -u mon-app --since "5 min ago"
tail -f /var/log/mon-app/error.log

# 4. Valgrind (fuites mémoire)
valgrind --leak-check=full ./mon-app
\`\`\`

## Méthodologie de dépannage

| Étape | Action | Outils |
|-------|--------|--------|
| 1 | Identifier les symptômes | top, dmesg, journalctl |
| 2 | Vérifier les ressources | free, df, vmstat |
| 3 | Isoler le composant | strace, tcpdump, lsof |
| 4 | Analyser les logs | journalctl, grep |
| 5 | Tester une hypothèse | Modifier et observer |
| 6 | Appliquer le correctif | Documenter la solution |
| 7 | Prévenir | Monitoring, alertes |

## Exercices

1. Simulez un manque d'espace disque et résolvez le problème en identifiant les fichiers responsables
2. Utilisez tcpdump pour diagnostiquer un problème de connexion entre deux services
3. Analysez les logs journalctl pour retrouver la cause d'un crash de service
4. Créez un script de diagnostic automatisé qui vérifie CPU, mémoire, disque et réseau
5. Simulez un OOM et configurez les scores OOM pour protéger vos services critiques
`;
