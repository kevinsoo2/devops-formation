export const rhelFilesystem = `# Système de Fichiers & Permissions

## Navigation dans le système de fichiers

### Commandes de navigation essentielles
\`\`\`bash
# Se déplacer dans les répertoires
cd /var/log
cd ~           # Répertoire home
cd -           # Répertoire précédent
pwd            # Afficher le répertoire courant

# Lister les fichiers
ls -la         # Liste détaillée avec fichiers cachés
ls -lh         # Tailles lisibles (human-readable)
ls -lR         # Récursif
ls -lt         # Trié par date de modification
ls -lS         # Trié par taille

# Informations sur les fichiers
file /etc/passwd       # Type de fichier
stat /etc/passwd       # Informations détaillées (inode, dates)
du -sh /var/log        # Taille d'un répertoire
df -h                  # Espace disque disponible
\`\`\`

### Arborescence Linux standard
\`\`\`
/
├── /bin        → Binaires essentiels (ls, cp, mv)
├── /sbin       → Binaires système (fdisk, iptables)
├── /etc        → Configuration système
├── /var        → Données variables (logs, spool, cache)
├── /home       → Répertoires utilisateurs
├── /root       → Home de root
├── /tmp        → Fichiers temporaires (nettoyé au reboot)
├── /usr        → Programmes utilisateur et bibliothèques
├── /opt        → Logiciels tiers
├── /proc       → Système de fichiers virtuel (processus)
├── /sys        → Informations matériel/kernel
├── /dev        → Fichiers de périphériques
├── /mnt        → Points de montage temporaires
└── /media      → Médias amovibles
\`\`\`


## Permissions standard (chmod)

### Comprendre les permissions
\`\`\`
-rwxr-xr-x  1 root root  4096 Jan 15 10:00 script.sh
│├─┤├─┤├─┤
│ │   │  └── Permissions pour les autres (other)
│ │   └───── Permissions pour le groupe (group)
│ └───────── Permissions pour le propriétaire (user/owner)
└──────────── Type (- fichier, d répertoire, l lien)
\`\`\`

| Permission | Fichier | Répertoire |
|-----------|---------|------------|
| **r (4)** | Lire le contenu | Lister le contenu |
| **w (2)** | Modifier le contenu | Créer/supprimer des fichiers |
| **x (1)** | Exécuter | Traverser (cd) |

### Modifier les permissions
\`\`\`bash
# Mode symbolique
chmod u+x script.sh          # Ajouter exécution pour le propriétaire
chmod g-w fichier.txt         # Retirer écriture pour le groupe
chmod o=r fichier.txt         # Définir lecture seule pour les autres
chmod a+r fichier.txt         # Ajouter lecture pour tous
chmod u=rwx,g=rx,o=r file    # Définir toutes les permissions

# Mode octal
chmod 755 script.sh           # rwxr-xr-x
chmod 644 config.txt          # rw-r--r--
chmod 600 secret.key          # rw-------
chmod 777 /tmp/shared         # rwxrwxrwx (à éviter !)

# Récursif
chmod -R 750 /opt/app/
\`\`\`

## Propriété (chown/chgrp)

\`\`\`bash
# Changer le propriétaire
chown alice fichier.txt
chown alice:developers fichier.txt    # Propriétaire et groupe
chown :developers fichier.txt          # Groupe uniquement

# Récursif
chown -R www-data:www-data /var/www/

# Changer le groupe uniquement
chgrp developers projet/
\`\`\`

## Permissions spéciales

\`\`\`bash
# SUID (4) - Exécuter avec les droits du propriétaire
chmod u+s /usr/bin/passwd      # ou chmod 4755
ls -l /usr/bin/passwd          # -rwsr-xr-x

# SGID (2) - Exécuter avec les droits du groupe
chmod g+s /opt/shared/         # ou chmod 2755
# Nouveau fichier dans ce dossier hérite du groupe

# Sticky bit (1) - Seul le propriétaire peut supprimer
chmod +t /tmp/                 # ou chmod 1777
ls -ld /tmp/                   # drwxrwxrwt
\`\`\`


## ACLs (Access Control Lists)

Les ACLs permettent des permissions plus granulaires que le système standard user/group/other.

\`\`\`bash
# Vérifier si les ACLs sont actives (signe + dans ls -l)
ls -l fichier.txt    # -rw-rwxr--+ 

# Voir les ACLs d'un fichier
getfacl fichier.txt

# Définir une ACL pour un utilisateur
setfacl -m u:alice:rwx fichier.txt

# Définir une ACL pour un groupe
setfacl -m g:developers:rx /opt/app/

# ACL par défaut (héritage pour les nouveaux fichiers)
setfacl -d -m g:developers:rwx /opt/projet/

# Supprimer une ACL spécifique
setfacl -x u:alice fichier.txt

# Supprimer toutes les ACLs
setfacl -b fichier.txt

# Copier les ACLs d'un fichier à un autre
getfacl source.txt | setfacl --set-file=- dest.txt
\`\`\`

## La commande find

\`\`\`bash
# Rechercher par nom
find / -name "*.conf"
find /etc -name "httpd*"
find / -iname "readme*"              # Insensible à la casse

# Rechercher par type
find /var -type f                     # Fichiers uniquement
find /home -type d                    # Répertoires uniquement
find /dev -type l                     # Liens symboliques

# Rechercher par permissions
find / -perm 777                      # Permissions exactes
find / -perm -u+s                     # Fichiers SUID
find / -perm /o+w                     # Écriture pour other

# Rechercher par propriétaire
find /home -user alice
find /var -group developers
find / -nouser                         # Fichiers sans propriétaire

# Rechercher par taille
find /var/log -size +100M              # Plus de 100 Mo
find /tmp -size -1k                    # Moins de 1 Ko

# Rechercher par date
find /var/log -mtime -7               # Modifié il y a moins de 7 jours
find /tmp -atime +30                  # Accédé il y a plus de 30 jours
find / -newer /etc/passwd             # Plus récent que ce fichier

# Actions
find /tmp -name "*.tmp" -delete                    # Supprimer
find /opt -name "*.log" -exec gzip {} \\;          # Compresser
find / -perm -o+w -type f -exec chmod o-w {} \\;   # Corriger permissions
find /home -user alice -exec chown bob {} +        # Changer propriétaire
\`\`\`

## Comparaison des méthodes de contrôle d'accès

| Méthode | Granularité | Complexité | Cas d'usage |
|---------|-------------|------------|-------------|
| **chmod/chown** | User/Group/Other | Simple | Cas standards |
| **ACLs** | Utilisateurs/groupes multiples | Moyenne | Accès partagé complexe |
| **SELinux** | Contextes de sécurité | Avancée | Sécurité renforcée |
| **Sticky bit** | Restriction de suppression | Simple | Répertoires partagés (/tmp) |
| **SUID/SGID** | Élévation de privilèges | Moyenne | Commandes système (passwd) |

## Exercice pratique

> **TP** :
> 1. Créez un répertoire /opt/projet avec le groupe "devops"
> 2. Configurez le SGID sur ce répertoire pour que les fichiers héritent du groupe
> 3. Définissez des ACLs pour qu'un utilisateur "stagiaire" ait accès en lecture seule
> 4. Utilisez find pour trouver tous les fichiers SUID sur le système
> 5. Trouvez tous les fichiers de plus de 50Mo modifiés cette semaine dans /var
`;


export const rhelServices = `# Gestion des Services (systemd)

## Qu'est-ce que systemd ?

systemd est le système d'initialisation et de gestion des services sur RHEL (depuis RHEL 7). Il remplace l'ancien SysVinit et gère :
- Le démarrage du système
- La gestion des services (démons)
- Les timers (remplaçant cron)
- Le journaling (logs)

## Commandes systemctl essentielles

\`\`\`bash
# Démarrer/Arrêter/Redémarrer un service
sudo systemctl start httpd
sudo systemctl stop httpd
sudo systemctl restart httpd
sudo systemctl reload httpd        # Recharger la config sans interruption

# Activer/Désactiver au démarrage
sudo systemctl enable httpd
sudo systemctl disable httpd
sudo systemctl enable --now httpd  # Activer ET démarrer

# Vérifier le statut
systemctl status httpd
systemctl is-active httpd
systemctl is-enabled httpd
systemctl is-failed httpd

# Lister les services
systemctl list-units --type=service
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=failed
systemctl list-unit-files --type=service

# Masquer un service (impossible à démarrer)
sudo systemctl mask httpd
sudo systemctl unmask httpd

# Recharger les fichiers unit après modification
sudo systemctl daemon-reload
\`\`\`

## Structure d'un fichier Unit

Les fichiers unit se trouvent dans :
- \`/usr/lib/systemd/system/\` — Units installés par les paquets (ne pas modifier)
- \`/etc/systemd/system/\` — Units personnalisés (prioritaire)
- \`/run/systemd/system/\` — Units runtime (temporaires)


## Créer un service personnalisé

### Exemple : application Node.js
\`\`\`ini
# /etc/systemd/system/mon-app.service
[Unit]
Description=Mon Application Node.js
Documentation=https://github.com/mon-app
After=network.target postgresql.service
Requires=postgresql.service
Wants=redis.service

[Service]
Type=simple
User=appuser
Group=appgroup
WorkingDirectory=/opt/mon-app
ExecStartPre=/usr/bin/npm install
ExecStart=/usr/bin/node server.js
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/bin/kill -TERM $MAINPID
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/etc/mon-app/env.conf
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
\`\`\`

### Exemple : service avec watchdog
\`\`\`ini
# /etc/systemd/system/webapp.service
[Unit]
Description=Web Application avec Watchdog
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
User=webapp
ExecStart=/opt/webapp/bin/start
WatchdogSec=30
Restart=always
RestartSec=10
TimeoutStartSec=60
TimeoutStopSec=30

# Sécurité
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
NoNewPrivileges=true
ReadWritePaths=/var/lib/webapp

[Install]
WantedBy=multi-user.target
\`\`\`

### Activer le service
\`\`\`bash
# Recharger systemd après création/modification
sudo systemctl daemon-reload

# Activer et démarrer
sudo systemctl enable --now mon-app.service

# Vérifier
systemctl status mon-app.service
\`\`\`

## Types de services

| Type | Description | Exemple |
|------|-------------|---------|
| **simple** | Le processus principal est le PID lancé | Node.js, Python |
| **forking** | Le processus fork un enfant et le parent quitte | Apache (httpd) |
| **oneshot** | Exécute une commande et quitte | Scripts d'init |
| **notify** | Comme simple, mais notifie systemd quand prêt | Avec sd_notify() |
| **idle** | Comme simple, attend que les jobs soient finis | Tâches de fin de boot |


## Journalctl (gestion des logs)

\`\`\`bash
# Voir les logs d'un service
journalctl -u httpd
journalctl -u httpd --no-pager

# Suivre en temps réel
journalctl -u mon-app -f

# Filtrer par priorité
journalctl -p err                    # Erreurs et plus grave
journalctl -p warning -u httpd       # Warnings pour httpd

# Filtrer par date
journalctl --since "2024-01-15"
journalctl --since "1 hour ago"
journalctl --since "2024-01-15 10:00" --until "2024-01-15 12:00"

# Logs du boot actuel
journalctl -b
journalctl -b -1                     # Boot précédent
journalctl --list-boots              # Lister les boots

# Logs du kernel
journalctl -k
journalctl -k -b -1                  # Kernel du boot précédent

# Format de sortie
journalctl -u httpd -o json-pretty   # Format JSON
journalctl -u httpd -o verbose       # Tous les champs

# Taille du journal
journalctl --disk-usage
sudo journalctl --vacuum-size=500M   # Limiter à 500Mo
sudo journalctl --vacuum-time=7d     # Garder 7 jours

# Configuration persistante (/etc/systemd/journald.conf)
# SystemMaxUse=500M
# MaxRetentionSec=1month
\`\`\`

## Targets (niveaux d'exécution)

Les targets remplacent les anciens runlevels.

| Target | Ancien Runlevel | Description |
|--------|-----------------|-------------|
| **poweroff.target** | 0 | Arrêt du système |
| **rescue.target** | 1 | Mode maintenance (single user) |
| **multi-user.target** | 3 | Multi-utilisateur sans GUI |
| **graphical.target** | 5 | Multi-utilisateur avec GUI |
| **reboot.target** | 6 | Redémarrage |
| **emergency.target** | — | Mode urgence (shell minimal) |

\`\`\`bash
# Voir la target par défaut
systemctl get-default

# Changer la target par défaut
sudo systemctl set-default multi-user.target

# Basculer vers une target
sudo systemctl isolate rescue.target
sudo systemctl isolate multi-user.target

# Lister les targets disponibles
systemctl list-units --type=target
\`\`\`

## Timers systemd (alternative à cron)

\`\`\`ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Timer de backup quotidien

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
\`\`\`

\`\`\`ini
# /etc/systemd/system/backup.service
[Unit]
Description=Script de backup

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh
User=backup
\`\`\`

\`\`\`bash
# Activer le timer
sudo systemctl enable --now backup.timer

# Lister les timers actifs
systemctl list-timers
\`\`\`

## Exercice pratique

> **TP** :
> 1. Créez un script simple (/opt/scripts/status.sh) qui écrit la date dans un fichier
> 2. Créez un fichier unit de type oneshot pour ce script
> 3. Créez un timer qui exécute ce service toutes les 5 minutes
> 4. Activez le timer et vérifiez son fonctionnement avec journalctl
> 5. Créez un service de type "simple" pour une application fictive avec restart automatique
`;


export const rhelNetworking = `# Configuration Réseau

## NetworkManager

NetworkManager est le service de gestion réseau par défaut sur RHEL. Il gère les connexions réseau de manière dynamique.

\`\`\`bash
# Statut de NetworkManager
systemctl status NetworkManager

# Afficher les connexions
nmcli connection show
nmcli connection show --active

# Afficher les interfaces
nmcli device status
nmcli device show ens192

# Informations réseau rapides
ip addr show
ip route show
ip -s link show    # Statistiques
\`\`\`

## nmcli - Configuration réseau

### Créer une connexion
\`\`\`bash
# Connexion avec IP statique
sudo nmcli connection add \\
  con-name "static-eth0" \\
  type ethernet \\
  ifname ens192 \\
  ipv4.addresses 192.168.1.100/24 \\
  ipv4.gateway 192.168.1.1 \\
  ipv4.dns "8.8.8.8 8.8.4.4" \\
  ipv4.method manual

# Connexion DHCP
sudo nmcli connection add \\
  con-name "dhcp-eth0" \\
  type ethernet \\
  ifname ens192 \\
  ipv4.method auto
\`\`\`

### Modifier une connexion existante
\`\`\`bash
# Changer l'adresse IP
sudo nmcli connection modify "static-eth0" ipv4.addresses "192.168.1.200/24"

# Ajouter un DNS
sudo nmcli connection modify "static-eth0" +ipv4.dns "1.1.1.1"

# Désactiver IPv6
sudo nmcli connection modify "static-eth0" ipv6.method disabled

# Activer la connexion automatique
sudo nmcli connection modify "static-eth0" connection.autoconnect yes

# Appliquer les changements
sudo nmcli connection up "static-eth0"
sudo nmcli connection reload
\`\`\`

### Diagnostics réseau
\`\`\`bash
# Tester la connectivité
ping -c 4 192.168.1.1
ping -c 4 google.com

# Tracer une route
traceroute google.com
mtr google.com

# Résolution DNS
nslookup example.com
dig example.com
host example.com

# Ports ouverts et connexions
ss -tlnp          # TCP en écoute
ss -ulnp          # UDP en écoute
ss -tunapl        # Toutes les connexions avec PID
\`\`\`


## Firewalld

firewalld est le pare-feu dynamique par défaut sur RHEL. Il utilise des zones pour grouper les règles.

### Commandes de base
\`\`\`bash
# Statut
sudo firewall-cmd --state
systemctl status firewalld

# Zone par défaut
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones

# Lister les règles de la zone active
sudo firewall-cmd --list-all
sudo firewall-cmd --zone=public --list-all
\`\`\`

### Gérer les services et ports
\`\`\`bash
# Ouvrir un service prédéfini
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent

# Ouvrir un port spécifique
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --add-port=3000-3100/tcp --permanent

# Supprimer une règle
sudo firewall-cmd --remove-port=8080/tcp --permanent
sudo firewall-cmd --remove-service=http --permanent

# Appliquer les changements permanents
sudo firewall-cmd --reload

# Lister les services disponibles
firewall-cmd --get-services
\`\`\`

### Zones firewalld

| Zone | Description |
|------|-------------|
| **drop** | Tout rejeté, pas de réponse |
| **block** | Tout rejeté, avec réponse icmp |
| **public** | Zone par défaut, restreinte |
| **external** | Pour NAT/masquerading |
| **dmz** | Zone démilitarisée |
| **work** | Réseau de travail, plus permissif |
| **home** | Réseau domestique |
| **internal** | Réseau interne |
| **trusted** | Tout accepté |

### Règles avancées (rich rules)
\`\`\`bash
# Autoriser une IP spécifique
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.50" service name="ssh" accept' --permanent

# Bloquer une IP
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="10.0.0.100" drop' --permanent

# Limiter les connexions (rate limiting)
sudo firewall-cmd --add-rich-rule='rule service name="ssh" limit value="3/m" accept' --permanent

# Port forwarding
sudo firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080 --permanent
sudo firewall-cmd --add-forward-port=port=443:proto=tcp:toaddr=192.168.1.10:toport=8443 --permanent

# Appliquer
sudo firewall-cmd --reload
\`\`\`


## Configuration DNS

### Fichiers de configuration
\`\`\`bash
# Résolveur DNS (géré par NetworkManager)
cat /etc/resolv.conf

# Configuration manuelle via nmcli
sudo nmcli connection modify "ens192" ipv4.dns "8.8.8.8 8.8.4.4"
sudo nmcli connection modify "ens192" ipv4.dns-search "example.com local"
sudo nmcli connection up "ens192"

# Résolution locale (hosts)
sudo vim /etc/hosts
# 192.168.1.10  serveur1.local serveur1
# 192.168.1.11  serveur2.local serveur2

# Ordre de résolution
cat /etc/nsswitch.conf
# hosts: files dns myhostname
\`\`\`

### Hostname
\`\`\`bash
# Voir le hostname
hostnamectl

# Modifier le hostname
sudo hostnamectl set-hostname serveur1.example.com

# Hostname transitoire (non persistant)
sudo hostnamectl set-hostname --transient test-server
\`\`\`

## Comparaison des outils réseau

| Commande | Usage | Exemple |
|----------|-------|---------|
| **nmcli** | Gestion des connexions NetworkManager | nmcli con show |
| **ip** | Afficher/configurer interfaces (bas niveau) | ip addr show |
| **ss** | Afficher sockets et connexions | ss -tlnp |
| **firewall-cmd** | Gérer le pare-feu | firewall-cmd --list-all |
| **dig/nslookup** | Résolution DNS | dig example.com |
| **ping** | Tester la connectivité | ping -c 4 host |
| **traceroute** | Tracer le chemin réseau | traceroute host |
| **curl** | Tester HTTP | curl -I http://host |

## Exercice pratique

> **TP** :
> 1. Configurez une interface réseau avec une IP statique via nmcli
> 2. Ajoutez des serveurs DNS (8.8.8.8 et 1.1.1.1)
> 3. Ouvrez les ports 80/tcp et 443/tcp dans firewalld
> 4. Créez une rich rule pour autoriser SSH uniquement depuis le réseau 192.168.1.0/24
> 5. Configurez un port forwarding du port 8080 vers le port 80
> 6. Vérifiez la configuration avec ss et firewall-cmd --list-all
`;


export const rhelStorage = `# Stockage Avancé (LVM, Stratis)

## LVM - Logical Volume Manager

LVM ajoute une couche d'abstraction entre les disques physiques et les systèmes de fichiers, permettant :
- Redimensionnement dynamique des volumes
- Snapshots
- Regroupement de plusieurs disques

### Architecture LVM
\`\`\`
┌────────────────────────────────────────────┐
│         Logical Volumes (LV)                │
│   /dev/vg_data/lv_app  /dev/vg_data/lv_db │
├────────────────────────────────────────────┤
│         Volume Group (VG)                   │
│              vg_data                        │
├────────────────────────────────────────────┤
│         Physical Volumes (PV)               │
│     /dev/sdb1      /dev/sdc1               │
├────────────────────────────────────────────┤
│         Disques physiques                   │
│       /dev/sdb       /dev/sdc              │
└────────────────────────────────────────────┘
\`\`\`

### Créer des Physical Volumes (PV)
\`\`\`bash
# Créer des partitions (type LVM : 8e00)
sudo fdisk /dev/sdb
# ou
sudo gdisk /dev/sdb

# Initialiser les PV
sudo pvcreate /dev/sdb1
sudo pvcreate /dev/sdc1

# Vérifier
sudo pvs
sudo pvdisplay
\`\`\`

### Créer un Volume Group (VG)
\`\`\`bash
# Créer un VG avec les PV
sudo vgcreate vg_data /dev/sdb1 /dev/sdc1

# Étendre un VG existant
sudo vgextend vg_data /dev/sdd1

# Vérifier
sudo vgs
sudo vgdisplay vg_data
\`\`\`


### Créer des Logical Volumes (LV)
\`\`\`bash
# Créer un LV de taille fixe
sudo lvcreate -L 10G -n lv_app vg_data

# Créer un LV utilisant un pourcentage de l'espace libre
sudo lvcreate -l 50%FREE -n lv_db vg_data

# Créer un LV utilisant tout l'espace restant
sudo lvcreate -l 100%FREE -n lv_logs vg_data

# Vérifier
sudo lvs
sudo lvdisplay /dev/vg_data/lv_app
\`\`\`

### Formater et monter
\`\`\`bash
# Créer un système de fichiers
sudo mkfs.xfs /dev/vg_data/lv_app
sudo mkfs.ext4 /dev/vg_data/lv_db

# Créer les points de montage
sudo mkdir -p /opt/app /var/lib/db

# Monter
sudo mount /dev/vg_data/lv_app /opt/app
sudo mount /dev/vg_data/lv_db /var/lib/db

# Vérifier
df -h
lsblk
\`\`\`

### Redimensionner un LV
\`\`\`bash
# Étendre un LV (XFS)
sudo lvextend -L +5G /dev/vg_data/lv_app
sudo xfs_growfs /opt/app

# Étendre un LV (ext4)
sudo lvextend -L +5G /dev/vg_data/lv_db
sudo resize2fs /dev/vg_data/lv_db

# Étendre LV + filesystem en une commande
sudo lvextend -r -L +5G /dev/vg_data/lv_app

# Réduire un LV (ext4 uniquement, XFS ne supporte pas la réduction)
sudo umount /var/lib/db
sudo e2fsck -f /dev/vg_data/lv_db
sudo resize2fs /dev/vg_data/lv_db 8G
sudo lvreduce -L 8G /dev/vg_data/lv_db
sudo mount /dev/vg_data/lv_db /var/lib/db
\`\`\`

### Snapshots LVM
\`\`\`bash
# Créer un snapshot
sudo lvcreate -L 2G -s -n snap_app /dev/vg_data/lv_app

# Restaurer depuis un snapshot
sudo umount /opt/app
sudo lvconvert --merge /dev/vg_data/snap_app
sudo mount /dev/vg_data/lv_app /opt/app

# Supprimer un snapshot
sudo lvremove /dev/vg_data/snap_app
\`\`\`


## Stratis (gestion simplifiée du stockage)

Stratis est un gestionnaire de stockage moderne pour RHEL 8+, combinant thin provisioning, snapshots et gestion de pool.

\`\`\`bash
# Installer Stratis
sudo dnf install stratisd stratis-cli -y
sudo systemctl enable --now stratisd

# Créer un pool
sudo stratis pool create pool1 /dev/sdb /dev/sdc

# Ajouter un disque au pool
sudo stratis pool add-data pool1 /dev/sdd

# Créer un filesystem
sudo stratis filesystem create pool1 fs_app
sudo stratis filesystem create pool1 fs_db

# Lister les pools et filesystems
stratis pool list
stratis filesystem list

# Monter un filesystem Stratis
sudo mkdir -p /opt/stratis-app
sudo mount /dev/stratis/pool1/fs_app /opt/stratis-app

# Snapshot
sudo stratis filesystem snapshot pool1 fs_app snap_fs_app

# Supprimer
sudo stratis filesystem destroy pool1 fs_app
sudo stratis pool destroy pool1
\`\`\`

## Montage persistant avec /etc/fstab

\`\`\`bash
# Format de /etc/fstab
# <device>                <mountpoint>   <type>  <options>       <dump> <pass>

# LVM
/dev/vg_data/lv_app      /opt/app       xfs     defaults        0 0
/dev/vg_data/lv_db       /var/lib/db    ext4    defaults        0 0

# Par UUID (recommandé)
UUID=abc123-def456       /data          xfs     defaults        0 0

# Stratis (utiliser x-systemd.requires)
/dev/stratis/pool1/fs_app /opt/stratis  xfs     defaults,x-systemd.requires=stratisd.service 0 0

# NFS
nfs-server:/share        /mnt/nfs       nfs     defaults,_netdev 0 0

# tmpfs (RAM disk)
tmpfs                    /tmp/ramdisk   tmpfs   size=512M       0 0
\`\`\`

\`\`\`bash
# Trouver l'UUID d'un device
blkid /dev/vg_data/lv_app
lsblk -f

# Tester fstab sans redémarrer
sudo mount -a

# Monter/Démonter
sudo mount /opt/app
sudo umount /opt/app
\`\`\`

## Comparaison des solutions de stockage

| Solution | Avantages | Inconvénients | Cas d'usage |
|----------|-----------|---------------|-------------|
| **Partition standard** | Simple, rapide | Taille fixe, pas de flexibilité | Boot, swap |
| **LVM** | Flexible, snapshots, redimensionnement | Complexité | Serveurs, VMs |
| **Stratis** | Simple, thin provisioning, moderne | Moins mature | RHEL 8+, nouveau déploiement |
| **XFS** | Performant, grande taille | Pas de réduction | Données, logs |
| **ext4** | Stable, réduction possible | Moins performant sur gros fichiers | Usage général |

## Exercice pratique

> **TP** :
> 1. Créez deux partitions LVM sur un disque
> 2. Créez un Volume Group "vg_tp" avec ces partitions
> 3. Créez deux Logical Volumes : lv_web (5G, XFS) et lv_data (3G, ext4)
> 4. Montez-les dans /srv/web et /srv/data
> 5. Ajoutez les entrées dans /etc/fstab avec les UUID
> 6. Étendez lv_web de 2G supplémentaires sans interruption
`;


export const rhelSecurity = `# SELinux & Sécurité

## Qu'est-ce que SELinux ?

Security-Enhanced Linux (SELinux) est un module de sécurité du kernel Linux qui fournit un contrôle d'accès obligatoire (MAC - Mandatory Access Control). Contrairement aux permissions DAC (chmod), SELinux applique des politiques de sécurité que même root ne peut pas contourner.

## Modes SELinux

\`\`\`bash
# Vérifier le mode actuel
getenforce
sestatus

# Changer le mode temporairement
sudo setenforce 0    # Permissive (logs mais n'empêche pas)
sudo setenforce 1    # Enforcing (applique les politiques)

# Changer le mode de façon permanente
sudo vim /etc/selinux/config
# SELINUX=enforcing    (enforcing, permissive, disabled)
# SELINUXTYPE=targeted
\`\`\`

| Mode | Comportement | Usage |
|------|-------------|-------|
| **Enforcing** | Applique les politiques, bloque et log | Production |
| **Permissive** | Log les violations mais ne bloque pas | Debug, troubleshooting |
| **Disabled** | SELinux complètement désactivé | Non recommandé |

## Contextes SELinux

Chaque fichier, processus et port a un contexte SELinux :
\`\`\`
user:role:type:level
system_u:object_r:httpd_sys_content_t:s0
\`\`\`

\`\`\`bash
# Voir le contexte des fichiers
ls -Z /var/www/html/
# -rw-r--r--. root root system_u:object_r:httpd_sys_content_t:s0 index.html

# Voir le contexte des processus
ps -eZ | grep httpd
# system_u:system_r:httpd_t:s0  1234 ? httpd

# Voir le contexte des ports
sudo semanage port -l | grep http
# http_port_t    tcp    80, 443, 8080
\`\`\`


### Modifier les contextes

\`\`\`bash
# Changer le contexte d'un fichier (temporaire)
sudo chcon -t httpd_sys_content_t /opt/webapp/index.html

# Changer le contexte récursivement
sudo chcon -R -t httpd_sys_content_t /opt/webapp/

# Définir le contexte par défaut (persistant après restorecon)
sudo semanage fcontext -a -t httpd_sys_content_t "/opt/webapp(/.*)?"

# Appliquer les contextes par défaut
sudo restorecon -Rv /opt/webapp/

# Restaurer les contextes de tout le filesystem
sudo restorecon -Rv /
# ou au prochain boot : touch /.autorelabel && reboot
\`\`\`

### Ajouter un port personnalisé
\`\`\`bash
# Autoriser Apache sur le port 8443
sudo semanage port -a -t http_port_t -p tcp 8443

# Vérifier
sudo semanage port -l | grep http_port_t

# Supprimer un port
sudo semanage port -d -t http_port_t -p tcp 8443
\`\`\`

## Booleans SELinux

Les booleans sont des interrupteurs on/off pour les politiques SELinux.

\`\`\`bash
# Lister tous les booleans
getsebool -a
getsebool -a | grep httpd

# Voir la description d'un boolean
sudo semanage boolean -l | grep httpd_can_network_connect

# Activer un boolean (temporaire)
sudo setsebool httpd_can_network_connect on

# Activer un boolean (persistant)
sudo setsebool -P httpd_can_network_connect on
sudo setsebool -P httpd_can_sendmail on
sudo setsebool -P httpd_enable_homedirs on
\`\`\`

### Booleans courants

| Boolean | Description |
|---------|-------------|
| httpd_can_network_connect | Apache peut se connecter au réseau |
| httpd_can_network_connect_db | Apache peut se connecter aux DB |
| httpd_enable_homedirs | Apache peut servir les home dirs |
| httpd_can_sendmail | Apache peut envoyer des mails |
| allow_httpd_anon_write | Apache peut écrire dans les dirs anon |
| samba_enable_home_dirs | Samba peut accéder aux home dirs |
| nfs_export_all_rw | NFS peut exporter en lecture-écriture |


## Troubleshooting SELinux

### Analyser les blocages
\`\`\`bash
# Installer les outils de diagnostic
sudo dnf install setroubleshoot-server setroubleshoot-plugins -y

# Voir les alertes SELinux
sudo sealert -a /var/log/audit/audit.log

# Chercher les AVC (Access Vector Cache) dans les logs
sudo ausearch -m AVC -ts recent
sudo ausearch -m AVC --start today

# Logs journalctl
journalctl -t setroubleshoot --since "1 hour ago"

# Audit2why - comprendre pourquoi un accès est refusé
sudo ausearch -m AVC -ts recent | audit2why

# Audit2allow - générer une règle pour autoriser
sudo ausearch -m AVC -ts recent | audit2allow -M mon_module
sudo semodule -i mon_module.pp
\`\`\`

### Processus de troubleshooting
\`\`\`bash
# 1. Vérifier si SELinux bloque
sudo ausearch -m AVC -ts recent

# 2. Analyser le blocage
sudo sealert -a /var/log/audit/audit.log | head -50

# 3. Solution courante : corriger le contexte
sudo restorecon -Rv /chemin/problematique

# 4. Ou activer un boolean
sudo setsebool -P httpd_can_network_connect on

# 5. Ou ajouter un port
sudo semanage port -a -t http_port_t -p tcp 9090

# 6. En dernier recours : créer un module personnalisé
sudo ausearch -m AVC -ts recent | audit2allow -M fix_policy
sudo semodule -i fix_policy.pp
\`\`\`

## Audit et sécurité système

### auditd - Audit système
\`\`\`bash
# Installer et activer auditd
sudo dnf install audit -y
sudo systemctl enable --now auditd

# Ajouter une règle d'audit
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/shadow -p wa -k shadow_changes
sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes

# Règles persistantes dans /etc/audit/rules.d/
echo '-w /etc/passwd -p wa -k passwd_changes' | sudo tee /etc/audit/rules.d/passwd.rules

# Rechercher dans les logs d'audit
sudo ausearch -k passwd_changes
sudo ausearch -k passwd_changes --start today
sudo aureport --summary
sudo aureport --login --summary
\`\`\`

### Durcissement de base
\`\`\`bash
# Désactiver les services inutiles
sudo systemctl disable --now cups bluetooth avahi-daemon

# Configurer les mots de passe
sudo vim /etc/security/pwquality.conf
# minlen = 12
# dcredit = -1
# ucredit = -1
# lcredit = -1
# ocredit = -1

# Verrouiller les comptes après échecs
sudo vim /etc/security/faillock.conf
# deny = 5
# unlock_time = 900

# Vérifier les permissions sensibles
find / -perm -4000 -type f 2>/dev/null    # Fichiers SUID
find / -perm -2000 -type f 2>/dev/null    # Fichiers SGID
find / -nouser -o -nogroup 2>/dev/null    # Fichiers orphelins
\`\`\`


## Comparaison des mécanismes de sécurité

| Mécanisme | Type | Portée | Complexité |
|-----------|------|--------|------------|
| **DAC (chmod)** | Discrétionnaire | Fichiers | Simple |
| **SELinux** | Obligatoire (MAC) | Processus, fichiers, ports | Avancée |
| **firewalld** | Réseau | Ports, IP, zones | Moyenne |
| **auditd** | Monitoring | Événements système | Moyenne |
| **PAM** | Authentification | Login, sessions | Avancée |
| **faillock** | Anti-brute force | Comptes utilisateur | Simple |
| **crypto-policies** | Chiffrement | TLS, SSH, IPSec | Simple |

## Commandes de référence rapide

\`\`\`bash
# SELinux
getenforce                              # Mode actuel
sestatus                                # Statut détaillé
ls -Z                                   # Contexte fichiers
ps -eZ                                  # Contexte processus
semanage fcontext -l                    # Contextes définis
semanage port -l                        # Ports autorisés
getsebool -a                            # Booleans
sealert -a /var/log/audit/audit.log     # Diagnostic

# Audit
ausearch -m AVC -ts recent              # Blocages récents
aureport --summary                      # Résumé d'audit
auditctl -l                             # Règles actives
\`\`\`

## Exercice pratique

> **TP** :
> 1. Vérifiez que SELinux est en mode Enforcing
> 2. Installez Apache et créez un site dans /opt/webapp/ au lieu de /var/www/html/
> 3. Configurez Apache pour servir depuis /opt/webapp/ (DocumentRoot)
> 4. Constatez le blocage SELinux, analysez avec sealert
> 5. Corrigez en appliquant le bon contexte avec semanage fcontext et restorecon
> 6. Configurez Apache sur le port 9090 (ajoutez le port dans SELinux)
> 7. Activez le boolean pour que Apache puisse se connecter au réseau
> 8. Mettez en place une règle d'audit sur /etc/httpd/
`;
