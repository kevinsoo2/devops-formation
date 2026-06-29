export const ansibleInstallation = `# Installation et Configuration d'Ansible

## Prérequis

- Un système Linux (RHEL, Ubuntu, etc.) ou macOS pour le **Control Node**
- Python 3.8+ installé
- Accès SSH aux machines cibles

## Installation sur RHEL / CentOS / Fedora

\`\`\`bash
# Activer le repo EPEL (si RHEL/CentOS)
sudo dnf install epel-release -y

# Installer Ansible
sudo dnf install ansible-core -y

# Vérifier l'installation
ansible --version
\`\`\`

## Installation sur Ubuntu / Debian

\`\`\`bash
sudo apt update
sudo apt install software-properties-common -y
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible -y
\`\`\`

## Installation via pip (toutes plateformes)

\`\`\`bash
# Installer pip si nécessaire
sudo dnf install python3-pip -y

# Installer Ansible
pip3 install ansible

# Ou installer uniquement ansible-core (plus léger)
pip3 install ansible-core
\`\`\`

## Configuration initiale

### Fichier de configuration ansible.cfg

\`\`\`ini
# /etc/ansible/ansible.cfg ou ./ansible.cfg (prioritaire)
[defaults]
inventory = ./inventory.ini
remote_user = ansible
host_key_checking = False
retry_files_enabled = False
timeout = 30

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False
\`\`\`

### Créer votre premier inventaire

\`\`\`ini
# inventory.ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[dbservers]
db1 ansible_host=192.168.1.20

[all:vars]
ansible_user=ansible
ansible_ssh_private_key_file=~/.ssh/id_rsa
\`\`\`

### Configurer l'accès SSH

\`\`\`bash
# Générer une clé SSH (si pas encore fait)
ssh-keygen -t ed25519 -C "ansible"

# Copier la clé sur les machines cibles
ssh-copy-id ansible@192.168.1.10
ssh-copy-id ansible@192.168.1.11
ssh-copy-id ansible@192.168.1.20
\`\`\`

## Tester la connexion

\`\`\`bash
# Ping toutes les machines
ansible all -m ping

# Ping un groupe spécifique
ansible webservers -m ping

# Exécuter une commande ad-hoc
ansible all -m command -a "uptime"
\`\`\`

## Structure de projet recommandée

\`\`\`
mon-projet-ansible/
├── ansible.cfg
├── inventory.ini
├── playbooks/
│   ├── setup-web.yml
│   └── setup-db.yml
├── roles/
│   └── nginx/
├── group_vars/
│   ├── all.yml
│   └── webservers.yml
└── host_vars/
    └── web1.yml
\`\`\`

## Exercice pratique

> **TP** : Installez Ansible sur votre machine, créez un inventaire avec au moins 1 machine (peut être localhost), et vérifiez la connexion avec \`ansible all -m ping\`.

\`\`\`bash
# Test avec localhost
echo "[local]" > inventory.ini
echo "localhost ansible_connection=local" >> inventory.ini
ansible all -i inventory.ini -m ping
\`\`\`
`;

export const ansiblePlaybooks = `# Écrire des Playbooks Ansible

## Qu'est-ce qu'un Playbook ?

Un playbook est un fichier YAML qui décrit un ensemble de tâches à exécuter sur des machines.

## Structure d'un Playbook

\`\`\`yaml
---
# Un playbook contient une liste de "plays"
- name: Nom du play
  hosts: groupe_cible
  become: yes          # Exécuter en tant que root
  vars:
    variable1: valeur1
  tasks:
    - name: Description de la tâche
      module_name:
        parametre1: valeur1
        parametre2: valeur2
\`\`\`

## Premier Playbook complet

\`\`\`yaml
---
- name: Configuration d'un serveur web
  hosts: webservers
  become: yes

  vars:
    http_port: 80
    doc_root: /var/www/html

  tasks:
    - name: Installer Apache
      dnf:
        name: httpd
        state: present

    - name: Copier la page d'accueil
      copy:
        content: "<h1>Bienvenue sur {{ inventory_hostname }}</h1>"
        dest: "{{ doc_root }}/index.html"
        owner: apache
        group: apache
        mode: '0644'

    - name: Démarrer et activer Apache
      service:
        name: httpd
        state: started
        enabled: yes

    - name: Ouvrir le port HTTP dans le firewall
      firewalld:
        port: "{{ http_port }}/tcp"
        permanent: yes
        state: enabled
        immediate: yes
\`\`\`

## Variables et Facts

### Variables dans le playbook
\`\`\`yaml
vars:
  packages:
    - httpd
    - php
    - php-mysqlnd
\`\`\`

### Utiliser les facts (infos système)
\`\`\`yaml
tasks:
  - name: Afficher l'OS
    debug:
      msg: "OS: {{ ansible_distribution }} {{ ansible_distribution_version }}"
\`\`\`

## Conditions (when)

\`\`\`yaml
tasks:
  - name: Installer sur RedHat
    dnf:
      name: httpd
      state: present
    when: ansible_os_family == "RedHat"

  - name: Installer sur Debian
    apt:
      name: apache2
      state: present
    when: ansible_os_family == "Debian"
\`\`\`

## Boucles (loop)

\`\`\`yaml
tasks:
  - name: Créer plusieurs utilisateurs
    user:
      name: "{{ item.name }}"
      groups: "{{ item.groups }}"
      state: present
    loop:
      - { name: 'alice', groups: 'wheel' }
      - { name: 'bob', groups: 'developers' }
      - { name: 'charlie', groups: 'developers' }

  - name: Installer plusieurs paquets
    dnf:
      name: "{{ item }}"
      state: present
    loop:
      - httpd
      - php
      - mariadb-server
\`\`\`

## Handlers (actions déclenchées)

\`\`\`yaml
tasks:
  - name: Modifier la config Apache
    template:
      src: httpd.conf.j2
      dest: /etc/httpd/conf/httpd.conf
    notify: Restart Apache

handlers:
  - name: Restart Apache
    service:
      name: httpd
      state: restarted
\`\`\`

## Exécuter un Playbook

\`\`\`bash
# Exécution simple
ansible-playbook playbook.yml

# Avec un inventaire spécifique
ansible-playbook -i inventory.ini playbook.yml

# Mode check (dry run)
ansible-playbook playbook.yml --check

# Verbose
ansible-playbook playbook.yml -v

# Limiter à un hôte
ansible-playbook playbook.yml --limit web1
\`\`\`

## Exercice pratique

> **TP** : Créez un playbook qui installe nginx, copie un fichier index.html personnalisé, et démarre le service.

\`\`\`yaml
---
- name: TP - Installer Nginx
  hosts: webservers
  become: yes
  tasks:
    - name: Installer nginx
      dnf:
        name: nginx
        state: present
    - name: Page d'accueil
      copy:
        content: "<h1>Hello DevOps!</h1>"
        dest: /usr/share/nginx/html/index.html
    - name: Démarrer nginx
      service:
        name: nginx
        state: started
        enabled: yes
\`\`\`
`;

export const ansibleModules = `# Les Modules Essentiels d'Ansible

## Qu'est-ce qu'un module ?

Un module est une unité de code qu'Ansible exécute sur les machines cibles. Il existe plus de 3000 modules.

## Modules de gestion de paquets

### dnf / yum (Red Hat)
\`\`\`yaml
- name: Installer un paquet
  dnf:
    name: httpd
    state: present    # present, absent, latest

- name: Installer plusieurs paquets
  dnf:
    name:
      - httpd
      - php
      - mariadb-server
    state: present

- name: Mettre à jour tout le système
  dnf:
    name: "*"
    state: latest
\`\`\`

### apt (Debian/Ubuntu)
\`\`\`yaml
- name: Mettre à jour le cache et installer
  apt:
    name: nginx
    state: present
    update_cache: yes
\`\`\`

## Modules de fichiers

### copy
\`\`\`yaml
- name: Copier un fichier
  copy:
    src: files/app.conf
    dest: /etc/app/app.conf
    owner: root
    group: root
    mode: '0644'
    backup: yes

- name: Créer un fichier avec du contenu
  copy:
    content: |
      # Configuration
      server_name=production
      port=8080
    dest: /etc/app/config.ini
\`\`\`

### template (Jinja2)
\`\`\`yaml
- name: Déployer un template
  template:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    mode: '0644'
  notify: Reload Nginx
\`\`\`

Fichier template (nginx.conf.j2) :
\`\`\`jinja2
server {
    listen {{ http_port }};
    server_name {{ server_name }};
    root {{ doc_root }};

    location / {
        try_files $uri $uri/ =404;
    }
}
\`\`\`

### file
\`\`\`yaml
- name: Créer un répertoire
  file:
    path: /opt/myapp/logs
    state: directory
    owner: app
    group: app
    mode: '0755'

- name: Créer un lien symbolique
  file:
    src: /opt/myapp/current
    dest: /var/www/app
    state: link

- name: Supprimer un fichier
  file:
    path: /tmp/old_file.txt
    state: absent
\`\`\`

## Modules de services

### service / systemd
\`\`\`yaml
- name: Démarrer et activer un service
  service:
    name: httpd
    state: started
    enabled: yes

- name: Recharger un service (sans interruption)
  systemd:
    name: nginx
    state: reloaded
    daemon_reload: yes
\`\`\`

## Modules utilisateurs et groupes

### user
\`\`\`yaml
- name: Créer un utilisateur
  user:
    name: deploy
    groups: wheel
    shell: /bin/bash
    create_home: yes
    password: "{{ 'motdepasse' | password_hash('sha512') }}"
\`\`\`

### authorized_key
\`\`\`yaml
- name: Ajouter une clé SSH
  authorized_key:
    user: deploy
    state: present
    key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
\`\`\`

## Modules réseau et firewall

### firewalld
\`\`\`yaml
- name: Ouvrir le port 443
  firewalld:
    port: 443/tcp
    permanent: yes
    state: enabled
    immediate: yes
\`\`\`

## Modules de commandes

### command vs shell
\`\`\`yaml
- name: Exécuter une commande simple
  command: /usr/bin/uptime

- name: Commande avec pipe (nécessite shell)
  shell: cat /var/log/messages | grep error | wc -l
  register: error_count

- name: Afficher le résultat
  debug:
    msg: "Nombre d'erreurs : {{ error_count.stdout }}"
\`\`\`

## Module debug

\`\`\`yaml
- name: Afficher une variable
  debug:
    var: ansible_default_ipv4.address

- name: Afficher un message
  debug:
    msg: "Le serveur {{ inventory_hostname }} est prêt"
\`\`\`

## Exercice pratique

> **TP** : Créez un playbook qui :
> 1. Installe \`git\` et \`vim\`
> 2. Crée un utilisateur \`deploy\` avec le groupe \`wheel\`
> 3. Crée le répertoire \`/opt/app\` avec les bonnes permissions
> 4. Copie un fichier de configuration depuis un template
`;

export const ansibleRoles = `# Les Rôles Ansible

## Pourquoi les rôles ?

Les rôles permettent de :
- **Structurer** le code de manière réutilisable
- **Partager** du code entre projets
- **Séparer** les responsabilités

## Structure d'un rôle

\`\`\`
roles/
└── nginx/
    ├── tasks/
    │   └── main.yml        ← Tâches principales
    ├── handlers/
    │   └── main.yml        ← Handlers (restart, reload)
    ├── templates/
    │   └── nginx.conf.j2   ← Templates Jinja2
    ├── files/
    │   └── index.html      ← Fichiers statiques
    ├── vars/
    │   └── main.yml        ← Variables du rôle
    ├── defaults/
    │   └── main.yml        ← Valeurs par défaut
    ├── meta/
    │   └── main.yml        ← Dépendances
    └── README.md
\`\`\`

## Créer un rôle

\`\`\`bash
# Créer la structure automatiquement
ansible-galaxy role init roles/nginx
\`\`\`

## Exemple complet : rôle nginx

### defaults/main.yml
\`\`\`yaml
---
nginx_port: 80
nginx_server_name: localhost
nginx_doc_root: /usr/share/nginx/html
\`\`\`

### tasks/main.yml
\`\`\`yaml
---
- name: Installer nginx
  dnf:
    name: nginx
    state: present

- name: Déployer la configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/conf.d/default.conf
  notify: Reload nginx

- name: Copier la page d'accueil
  copy:
    src: index.html
    dest: "{{ nginx_doc_root }}/index.html"

- name: Démarrer nginx
  service:
    name: nginx
    state: started
    enabled: yes
\`\`\`

### handlers/main.yml
\`\`\`yaml
---
- name: Reload nginx
  service:
    name: nginx
    state: reloaded

- name: Restart nginx
  service:
    name: nginx
    state: restarted
\`\`\`

### templates/nginx.conf.j2
\`\`\`jinja2
server {
    listen {{ nginx_port }};
    server_name {{ nginx_server_name }};
    root {{ nginx_doc_root }};

    location / {
        try_files $uri $uri/ =404;
    }
}
\`\`\`

## Utiliser un rôle dans un playbook

\`\`\`yaml
---
- name: Configurer les serveurs web
  hosts: webservers
  become: yes
  roles:
    - nginx
    - { role: php, php_version: "8.1" }
    - role: ssl
      vars:
        ssl_domain: example.com
\`\`\`

## Ansible Galaxy : rôles communautaires

\`\`\`bash
# Rechercher un rôle
ansible-galaxy search nginx

# Installer un rôle depuis Galaxy
ansible-galaxy install geerlingguy.nginx

# Installer depuis un requirements.yml
ansible-galaxy install -r requirements.yml
\`\`\`

### requirements.yml
\`\`\`yaml
---
roles:
  - name: geerlingguy.nginx
    version: "3.2.0"
  - name: geerlingguy.mysql
  - src: https://github.com/user/custom-role.git
    name: custom-role
\`\`\`

## Exercice pratique

> **TP** : Créez un rôle \`webapp\` qui :
> 1. Installe nginx
> 2. Déploie un site via template avec une variable \`app_name\`
> 3. Configure un handler pour recharger nginx
> 4. Utilisez ce rôle dans un playbook
`;

export const ansibleVault = `# Ansible Vault & Sécurité

## Pourquoi Ansible Vault ?

Ansible Vault permet de **chiffrer** les données sensibles :
- Mots de passe
- Clés API
- Certificats
- Tokens d'accès

## Commandes de base

### Créer un fichier chiffré
\`\`\`bash
# Créer un nouveau fichier chiffré
ansible-vault create secrets.yml

# Chiffrer un fichier existant
ansible-vault encrypt group_vars/all/vault.yml

# Déchiffrer un fichier
ansible-vault decrypt secrets.yml

# Éditer un fichier chiffré
ansible-vault edit secrets.yml

# Voir le contenu sans déchiffrer
ansible-vault view secrets.yml

# Changer le mot de passe
ansible-vault rekey secrets.yml
\`\`\`

## Utilisation dans un projet

### Structure recommandée
\`\`\`
group_vars/
└── production/
    ├── vars.yml          ← Variables normales
    └── vault.yml         ← Variables chiffrées (préfixées vault_)
\`\`\`

### vars.yml
\`\`\`yaml
---
db_host: db.example.com
db_name: myapp
db_user: "{{ vault_db_user }}"
db_password: "{{ vault_db_password }}"
\`\`\`

### vault.yml (chiffré)
\`\`\`yaml
---
vault_db_user: admin
vault_db_password: SuperS3cretP@ss!
vault_api_key: sk-123456789abcdef
\`\`\`

## Exécuter avec Vault

\`\`\`bash
# Demander le mot de passe
ansible-playbook site.yml --ask-vault-pass

# Utiliser un fichier de mot de passe
ansible-playbook site.yml --vault-password-file ~/.vault_pass

# Avec plusieurs vault IDs
ansible-playbook site.yml --vault-id dev@prompt --vault-id prod@~/.vault_prod
\`\`\`

### Fichier de mot de passe
\`\`\`bash
# Créer le fichier (ne JAMAIS le committer !)
echo "mon_mot_de_passe_vault" > ~/.vault_pass
chmod 600 ~/.vault_pass

# L'ajouter dans .gitignore
echo ".vault_pass" >> .gitignore
\`\`\`

### Configuration dans ansible.cfg
\`\`\`ini
[defaults]
vault_password_file = ~/.vault_pass
\`\`\`

## Chiffrer des variables individuelles

\`\`\`bash
# Chiffrer une seule valeur
ansible-vault encrypt_string 'MonMotDePasse' --name 'db_password'
\`\`\`

Résultat à coller dans un fichier YAML :
\`\`\`yaml
db_password: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  61626364656667686970...
\`\`\`

## Bonnes pratiques de sécurité

| Pratique | Description |
|----------|-------------|
| Préfixer les variables vault | \`vault_db_pass\` référencé par \`db_pass\` |
| Ne jamais committer .vault_pass | Ajouter dans .gitignore |
| Utiliser des vault IDs | Séparer dev/staging/prod |
| Rotation régulière | Changer les mots de passe périodiquement |
| Least privilege | Donner le minimum d'accès nécessaire |

## Exercice pratique

> **TP** :
> 1. Créez un fichier \`vault.yml\` chiffré contenant un mot de passe DB
> 2. Référencez ce mot de passe dans un playbook
> 3. Exécutez le playbook avec \`--ask-vault-pass\`
`;
