export const terraformIntro = `# Introduction à Terraform

## Qu'est-ce que l'Infrastructure as Code (IaC) ?

L'**Infrastructure as Code** (IaC) est une pratique qui consiste à gérer et provisionner l'infrastructure informatique à travers des fichiers de configuration plutôt que par des processus manuels. L'IaC permet de :

- **Versionner** l'infrastructure comme du code applicatif
- **Reproduire** des environnements de manière identique
- **Automatiser** le provisionnement et la gestion
- **Documenter** l'état de l'infrastructure
- **Collaborer** efficacement en équipe

## Terraform vs autres outils IaC

| Caractéristique | Terraform | Pulumi | CloudFormation | Ansible |
|---|---|---|---|---|
| Langage | HCL | Python/Go/TS | JSON/YAML | YAML |
| Multi-cloud | ✅ Oui | ✅ Oui | ❌ AWS uniquement | ✅ Oui |
| Type | Déclaratif | Impératif/Déclaratif | Déclaratif | Impératif |
| State | Fichier d'état | Fichier d'état | Géré par AWS | Non |
| Maturité | Très mature | Récent | Mature | Très mature |
| Communauté | Très large | Croissante | Large (AWS) | Très large |
| Licence | BSL 1.1 | Apache 2.0 | Propriétaire | GPL |

## Qu'est-ce que Terraform ?

**Terraform** est un outil open-source développé par HashiCorp qui permet de définir, prévisualiser et déployer de l'infrastructure cloud de manière déclarative. Il utilise le langage **HCL** (HashiCorp Configuration Language).

### Caractéristiques principales

- **Déclaratif** : vous décrivez l'état souhaité, Terraform calcule les actions nécessaires
- **Multi-cloud** : supporte AWS, Azure, GCP, et des centaines d'autres providers
- **Plan d'exécution** : prévisualisation des changements avant application
- **Graphe de ressources** : gère automatiquement les dépendances
- **Modules réutilisables** : factorisation et partage de configurations

## Syntaxe de base HCL

### Blocs fondamentaux

\`\`\`hcl
# Configuration du provider
provider "aws" {
  region = "eu-west-3"
}

# Déclaration d'une ressource
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name        = "MonServeurWeb"
    Environment = "production"
  }
}

# Variable
variable "region" {
  description = "La région AWS à utiliser"
  type        = string
  default     = "eu-west-3"
}

# Output
output "instance_ip" {
  value       = aws_instance.web.public_ip
  description = "L'adresse IP publique de l'instance"
}
\`\`\`

### Types de données HCL

\`\`\`hcl
# String
name = "mon-serveur"

# Nombre
count = 3

# Booléen
enabled = true

# Liste
availability_zones = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]

# Map
tags = {
  Name        = "Production"
  Environment = "prod"
}
\`\`\`

## Le workflow Terraform

Le workflow Terraform se compose de quatre commandes principales :

\`\`\`
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  init    │ →  │  plan    │ →  │  apply   │ →  │  destroy     │
│          │    │          │    │          │    │  (optionnel) │
│ Initialise│   │ Prévisualise│  │ Applique │    │ Supprime     │
│ le projet │   │ les changes │  │ les changes│   │ les resources│
└──────────┘    └──────────┘    └──────────┘    └──────────────┘
\`\`\`

### 1. terraform init

Initialise le répertoire de travail, télécharge les providers et les modules.

\`\`\`bash
# Initialiser un projet Terraform
terraform init

# Mettre à jour les providers
terraform init -upgrade
\`\`\`

### 2. terraform plan

Crée un plan d'exécution montrant les changements qui seront appliqués.

\`\`\`bash
# Voir le plan d'exécution
terraform plan

# Sauvegarder le plan dans un fichier
terraform plan -out=tfplan
\`\`\`

### 3. terraform apply

Applique les changements pour atteindre l'état souhaité.

\`\`\`bash
# Appliquer les changements (avec confirmation)
terraform apply

# Appliquer un plan sauvegardé
terraform apply tfplan

# Appliquer sans confirmation (CI/CD)
terraform apply -auto-approve
\`\`\`

### 4. terraform destroy

Supprime toutes les ressources gérées par Terraform.

\`\`\`bash
# Détruire toutes les ressources
terraform destroy

# Détruire sans confirmation
terraform destroy -auto-approve

# Détruire une ressource spécifique
terraform destroy -target=aws_instance.web
\`\`\`

## Commandes utiles supplémentaires

\`\`\`bash
# Valider la syntaxe des fichiers
terraform validate

# Formater les fichiers HCL
terraform fmt

# Afficher l'état actuel
terraform show

# Lister les ressources dans le state
terraform state list
\`\`\`

## Exercice pratique

> **Exercice** : Créez votre premier projet Terraform.

1. Créez un répertoire de projet :

\`\`\`bash
mkdir mon-premier-terraform && cd mon-premier-terraform
\`\`\`

2. Créez un fichier \`main.tf\` :

\`\`\`hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

resource "local_file" "hello" {
  content  = "Bonjour depuis Terraform !"
  filename = "\${path.module}/hello.txt"
}

output "file_path" {
  value = local_file.hello.filename
}
\`\`\`

3. Exécutez le workflow complet :

\`\`\`bash
terraform init
terraform plan
terraform apply
cat hello.txt
terraform destroy
\`\`\`
`;


export const terraformInstallation = `# Installation et premiers pas

## Installation de Terraform

### Linux (Ubuntu/Debian)

\`\`\`bash
# Ajouter la clé GPG HashiCorp
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Ajouter le dépôt
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# Installer Terraform
sudo apt update && sudo apt install terraform -y

# Vérifier l'installation
terraform version
\`\`\`

### Linux (RHEL/CentOS/Fedora)

\`\`\`bash
# Ajouter le dépôt HashiCorp
sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo

# Installer Terraform
sudo dnf install terraform -y
\`\`\`

### macOS

\`\`\`bash
# Avec Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
\`\`\`

### Windows

\`\`\`powershell
# Avec Chocolatey
choco install terraform

# Avec Scoop
scoop install terraform
\`\`\`

### Installation manuelle (toutes plateformes)

\`\`\`bash
# Télécharger le binaire depuis releases.hashicorp.com
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip

# Extraire et déplacer
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Vérifier
terraform version
\`\`\`

## Configuration de l'autocomplétion

\`\`\`bash
# Installer l'autocomplétion pour bash
terraform -install-autocomplete

# Recharger le shell
source ~/.bashrc
\`\`\`

## Configuration des providers

### Provider AWS

\`\`\`hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"  # Paris
}
\`\`\`

Configuration des credentials AWS :

\`\`\`bash
# Option 1 : Variables d'environnement
export AWS_ACCESS_KEY_ID="votre-access-key"
export AWS_SECRET_ACCESS_KEY="votre-secret-key"
export AWS_DEFAULT_REGION="eu-west-3"

# Option 2 : AWS CLI (recommandé)
aws configure

# Option 3 : Fichier ~/.aws/credentials
cat ~/.aws/credentials
# [default]
# aws_access_key_id = AKIA...
# aws_secret_access_key = ...
\`\`\`

### Provider Azure

\`\`\`hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
\`\`\`

Configuration Azure :

\`\`\`bash
# Se connecter à Azure
az login

# Lister les subscriptions
az account list --output table

# Sélectionner une subscription
az account set --subscription "ID-de-la-subscription"

# Créer un Service Principal pour Terraform
az ad sp create-for-rbac --name "terraform-sp" --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
\`\`\`

### Provider GCP

\`\`\`hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "mon-projet-gcp"
  region  = "europe-west1"
  zone    = "europe-west1-b"
}
\`\`\`

Configuration GCP :

\`\`\`bash
# Authentification
gcloud auth application-default login

# Ou avec un fichier de clé de service
export GOOGLE_APPLICATION_CREDENTIALS="/chemin/vers/credentials.json"
\`\`\`

## Première ressource

Créons une instance EC2 sur AWS :

\`\`\`hcl
# main.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"
}

# Security Group
resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Security group pour serveur web"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-sg"
  }
}

# Instance EC2
resource "aws_instance" "web" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
  EOF

  tags = {
    Name        = "WebServer"
    Environment = "dev"
  }
}

output "public_ip" {
  value       = aws_instance.web.public_ip
  description = "IP publique du serveur web"
}
\`\`\`

## Le fichier terraform.tfstate

Le fichier **terraform.tfstate** est le cœur de Terraform. Il contient la correspondance entre votre configuration et les ressources réelles dans le cloud.

### Structure du state

\`\`\`json
{
  "version": 4,
  "terraform_version": "1.7.0",
  "resources": [
    {
      "mode": "managed",
      "type": "aws_instance",
      "name": "web",
      "provider": "provider[\\"registry.terraform.io/hashicorp/aws\\"]",
      "instances": [
        {
          "attributes": {
            "id": "i-0abc123def456",
            "ami": "ami-0c55b159cbfafe1f0",
            "instance_type": "t2.micro",
            "public_ip": "54.32.10.1"
          }
        }
      ]
    }
  ]
}
\`\`\`

### Bonnes pratiques pour le state

| Pratique | Raison |
|----------|--------|
| Ne jamais modifier manuellement | Risque de corruption |
| Stocker en remote | Collaboration et sécurité |
| Activer le locking | Éviter les modifications concurrentes |
| Chiffrer le state | Contient des données sensibles |
| Sauvegarder régulièrement | Récupération en cas de problème |

## .gitignore pour Terraform

\`\`\`gitignore
# Fichiers Terraform locaux
.terraform/
.terraform.lock.hcl

# State files (ne JAMAIS committer en remote state)
*.tfstate
*.tfstate.*

# Crash log files
crash.log
crash.*.log

# Fichiers de variables sensibles
*.tfvars
!example.tfvars

# Fichiers de plan
*.tfplan

# Fichiers de remplacement (override)
override.tf
override.tf.json
*_override.tf
*_override.tf.json
\`\`\`

## Structure recommandée d'un projet

\`\`\`
mon-projet-terraform/
├── main.tf              # Ressources principales
├── variables.tf         # Déclaration des variables
├── outputs.tf           # Déclaration des outputs
├── providers.tf         # Configuration des providers
├── terraform.tfvars     # Valeurs des variables (non versionné)
├── example.tfvars       # Exemple de valeurs (versionné)
├── versions.tf          # Contraintes de versions
├── .gitignore           # Fichiers à ignorer
├── .terraform.lock.hcl  # Lock des versions providers
└── README.md            # Documentation
\`\`\`

## Exercice pratique

> **Exercice** : Installez Terraform et créez votre première configuration.

1. Installez Terraform sur votre machine
2. Créez un projet avec la structure recommandée
3. Configurez le provider \`local\` et créez un fichier :

\`\`\`hcl
# providers.tf
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# main.tf
resource "local_file" "config" {
  content = jsonencode({
    app_name    = "mon-application"
    environment = "development"
    port        = 8080
  })
  filename = "\${path.module}/config.json"
}

# outputs.tf
output "config_path" {
  value = local_file.config.filename
}
\`\`\`

4. Exécutez \`terraform init\`, \`terraform plan\`, \`terraform apply\`
5. Vérifiez le contenu du fichier créé et du state
`;


export const terraformResources = `# Ressources et Data Sources

## Les blocs resource

Un **resource block** déclare une ressource d'infrastructure que Terraform doit gérer. Chaque ressource a un type et un nom local unique.

### Syntaxe de base

\`\`\`hcl
resource "<TYPE>" "<NOM_LOCAL>" {
  # Arguments de configuration
  argument1 = "valeur1"
  argument2 = "valeur2"

  # Bloc imbriqué
  bloc_imbrique {
    sous_argument = "valeur"
  }
}
\`\`\`

### Exemple complet : Infrastructure AWS

\`\`\`hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "vpc-production"
  }
}

# Subnet public
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-3a"
  map_public_ip_on_launch = true

  tags = {
    Name = "subnet-public"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw-production"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "rt-public"
  }
}

# Association Route Table / Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}
\`\`\`

## Data Sources

Les **data sources** permettent de récupérer des informations sur des ressources existantes qui ne sont pas gérées par votre configuration Terraform.

### Syntaxe

\`\`\`hcl
data "<TYPE>" "<NOM_LOCAL>" {
  # Filtres et arguments
  filter {
    name   = "nom-du-filtre"
    values = ["valeur"]
  }
}
\`\`\`

### Exemples de Data Sources

\`\`\`hcl
# Récupérer la dernière AMI Ubuntu
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Utiliser le data source dans une ressource
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}

# Récupérer les AZ disponibles
data "aws_availability_zones" "available" {
  state = "available"
}

# Récupérer un VPC existant par tag
data "aws_vpc" "existing" {
  filter {
    name   = "tag:Name"
    values = ["vpc-production"]
  }
}

# Récupérer le caller identity (compte AWS courant)
data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}
\`\`\`

## Dépendances entre ressources

### Dépendances implicites

Terraform détecte automatiquement les dépendances quand une ressource référence un attribut d'une autre.

\`\`\`hcl
# La subnet dépend implicitement du VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "web" {
  vpc_id     = aws_vpc.main.id  # Dépendance implicite
  cidr_block = "10.0.1.0/24"
}
\`\`\`

### Dépendances explicites

Utilisez \`depends_on\` quand il existe une dépendance que Terraform ne peut pas détecter automatiquement.

\`\`\`hcl
resource "aws_s3_bucket" "logs" {
  bucket = "mon-bucket-logs"
}

resource "aws_s3_bucket_policy" "logs_policy" {
  bucket = aws_s3_bucket.logs.id
  policy = data.aws_iam_policy_document.logs.json
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  # Dépendance explicite : attendre que la policy soit en place
  depends_on = [aws_s3_bucket_policy.logs_policy]
}
\`\`\`

### Graphe des dépendances

\`\`\`bash
# Visualiser le graphe de dépendances
terraform graph | dot -Tpng > graph.png

# Format DOT brut
terraform graph
\`\`\`

## Règles de lifecycle

Les blocs \`lifecycle\` permettent de personnaliser le comportement de Terraform lors de la gestion des ressources.

### create_before_destroy

Crée la nouvelle ressource avant de détruire l'ancienne (utile pour les mises à jour sans interruption).

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  lifecycle {
    create_before_destroy = true
  }
}
\`\`\`

### prevent_destroy

Empêche la destruction accidentelle d'une ressource critique.

\`\`\`hcl
resource "aws_db_instance" "production" {
  identifier     = "prod-database"
  engine         = "postgresql"
  engine_version = "15.0"
  instance_class = "db.t3.medium"

  lifecycle {
    prevent_destroy = true
  }
}
\`\`\`

### ignore_changes

Ignore certains attributs lors de la comparaison entre la configuration et l'état réel.

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  lifecycle {
    # Ignorer les changements de tags faits manuellement
    ignore_changes = [tags, user_data]
  }
}
\`\`\`

### replace_triggered_by

Force le remplacement d'une ressource quand une autre change.

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  lifecycle {
    replace_triggered_by = [
      aws_security_group.web.id
    ]
  }
}
\`\`\`

### Tableau récapitulatif des lifecycle rules

| Règle | Usage | Exemple |
|-------|-------|---------|
| \`create_before_destroy\` | Zero-downtime updates | Load balancers, instances |
| \`prevent_destroy\` | Protection ressources critiques | Bases de données, S3 |
| \`ignore_changes\` | Attributs gérés hors Terraform | Tags manuels, autoscaling |
| \`replace_triggered_by\` | Remplacement conditionnel | Dépendances complexes |

## Provisioners

Les **provisioners** exécutent des scripts sur une ressource après sa création ou avant sa destruction.

> ⚠️ **Attention** : Les provisioners sont un dernier recours. Préférez \`user_data\`, cloud-init, ou des outils comme Ansible.

### local-exec

Exécute une commande sur la machine qui exécute Terraform.

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  provisioner "local-exec" {
    command = "echo \${self.public_ip} >> hosts.txt"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Instance détruite' >> log.txt"
  }
}
\`\`\`

### remote-exec

Exécute une commande sur la ressource distante via SSH ou WinRM.

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/id_rsa")
    host        = self.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx",
      "sudo systemctl start nginx"
    ]
  }
}
\`\`\`

### file

Copie des fichiers ou répertoires vers la ressource distante.

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/id_rsa")
    host        = self.public_ip
  }

  provisioner "file" {
    source      = "scripts/setup.sh"
    destination = "/tmp/setup.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup.sh",
      "sudo /tmp/setup.sh"
    ]
  }
}
\`\`\`

## Méta-arguments des ressources

### count

Crée plusieurs instances d'une ressource.

\`\`\`hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  tags = {
    Name = "web-\${count.index + 1}"
  }
}

# Accéder aux instances
output "ips" {
  value = aws_instance.web[*].public_ip
}
\`\`\`

### for_each

Crée des ressources à partir d'une map ou d'un set.

\`\`\`hcl
variable "instances" {
  default = {
    web    = "t3.micro"
    api    = "t3.small"
    worker = "t3.medium"
  }
}

resource "aws_instance" "servers" {
  for_each      = var.instances
  ami           = data.aws_ami.ubuntu.id
  instance_type = each.value

  tags = {
    Name = each.key
    Role = each.key
  }
}

# Accéder aux instances
output "server_ips" {
  value = { for k, v in aws_instance.servers : k => v.public_ip }
}
\`\`\`

## Exercice pratique

> **Exercice** : Créez une infrastructure réseau complète sur AWS.

\`\`\`hcl
# Créez les ressources suivantes :
# 1. Un VPC avec le CIDR 10.0.0.0/16
# 2. Deux subnets (public et privé)
# 3. Un Internet Gateway
# 4. Une route table pour le subnet public
# 5. Un Security Group autorisant HTTP et SSH
# 6. Une instance EC2 dans le subnet public
# 7. Utilisez un data source pour l'AMI
# 8. Ajoutez lifecycle prevent_destroy sur le VPC

# Bonus : Utilisez for_each pour créer 3 subnets dans des AZ différentes
\`\`\`
`;


export const terraformVariables = `# Variables et Outputs

## Variables d'entrée (Input Variables)

Les **variables d'entrée** permettent de paramétrer vos configurations Terraform sans modifier le code.

### Déclaration de variables

\`\`\`hcl
# variables.tf

# Variable simple avec valeur par défaut
variable "region" {
  description = "La région AWS à utiliser"
  type        = string
  default     = "eu-west-3"
}

# Variable obligatoire (sans default)
variable "environment" {
  description = "L'environnement de déploiement"
  type        = string
}

# Variable sensible
variable "db_password" {
  description = "Mot de passe de la base de données"
  type        = string
  sensitive   = true
}

# Variable avec valeur nullable
variable "custom_ami" {
  description = "AMI personnalisée (optionnelle)"
  type        = string
  default     = null
  nullable    = true
}
\`\`\`

### Utilisation des variables

\`\`\`hcl
# main.tf
provider "aws" {
  region = var.region
}

resource "aws_instance" "web" {
  ami           = var.custom_ami != null ? var.custom_ami : data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  tags = {
    Name        = "web-\${var.environment}"
    Environment = var.environment
  }
}
\`\`\`

## Types de variables

### Types primitifs

\`\`\`hcl
# String
variable "name" {
  type    = string
  default = "mon-serveur"
}

# Number
variable "instance_count" {
  type    = number
  default = 3
}

# Bool
variable "enable_monitoring" {
  type    = bool
  default = true
}
\`\`\`

### Types complexes

\`\`\`hcl
# List (séquence ordonnée)
variable "availability_zones" {
  type    = list(string)
  default = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]
}

# Set (collection sans doublons)
variable "allowed_ports" {
  type    = set(number)
  default = [80, 443, 8080]
}

# Map (paires clé-valeur)
variable "instance_types" {
  type = map(string)
  default = {
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.medium"
  }
}

# Tuple (types mixtes dans une séquence)
variable "config" {
  type    = tuple([string, number, bool])
  default = ["web", 3, true]
}

# Object (structure avec types définis)
variable "database_config" {
  type = object({
    engine         = string
    version        = string
    instance_class = string
    storage_gb     = number
    multi_az       = bool
    tags           = map(string)
  })
  default = {
    engine         = "postgresql"
    version        = "15.0"
    instance_class = "db.t3.medium"
    storage_gb     = 100
    multi_az       = true
    tags = {
      Team = "backend"
    }
  }
}

# List d'objects
variable "subnets" {
  type = list(object({
    cidr_block        = string
    availability_zone = string
    public            = bool
  }))
  default = [
    {
      cidr_block        = "10.0.1.0/24"
      availability_zone = "eu-west-3a"
      public            = true
    },
    {
      cidr_block        = "10.0.2.0/24"
      availability_zone = "eu-west-3b"
      public            = false
    }
  ]
}
\`\`\`

## Validation des variables

\`\`\`hcl
variable "environment" {
  description = "L'environnement de déploiement"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "L'environnement doit être 'dev', 'staging' ou 'prod'."
  }
}

variable "instance_type" {
  description = "Le type d'instance EC2"
  type        = string
  default     = "t3.micro"

  validation {
    condition     = can(regex("^t[23]\\\\.", var.instance_type))
    error_message = "Seules les instances t2.* et t3.* sont autorisées."
  }
}

variable "cidr_block" {
  description = "Bloc CIDR du VPC"
  type        = string

  validation {
    condition     = can(cidrhost(var.cidr_block, 0))
    error_message = "La valeur doit être un bloc CIDR valide."
  }
}

variable "port" {
  description = "Port de l'application"
  type        = number

  validation {
    condition     = var.port >= 1 && var.port <= 65535
    error_message = "Le port doit être entre 1 et 65535."
  }
}
\`\`\`

## Fichier terraform.tfvars

Le fichier \`terraform.tfvars\` permet de définir les valeurs des variables.

### terraform.tfvars

\`\`\`hcl
# terraform.tfvars
region         = "eu-west-3"
environment    = "prod"
instance_type  = "t3.small"
instance_count = 3

availability_zones = [
  "eu-west-3a",
  "eu-west-3b",
]

tags = {
  Project = "mon-projet"
  Team    = "devops"
  Owner   = "equipe-infra"
}
\`\`\`

### Fichiers .tfvars multiples

\`\`\`bash
# Structure par environnement
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── main.tf
├── variables.tf
└── outputs.tf

# Utiliser un fichier spécifique
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
\`\`\`

### Ordre de précédence des variables

| Priorité | Source | Exemple |
|----------|--------|---------|
| 1 (plus faible) | Default dans la déclaration | \`default = "value"\` |
| 2 | terraform.tfvars | Fichier automatiquement chargé |
| 3 | *.auto.tfvars | Fichiers chargés par ordre alphabétique |
| 4 | -var-file | \`terraform apply -var-file="prod.tfvars"\` |
| 5 | -var en ligne de commande | \`terraform apply -var="region=us-east-1"\` |
| 6 (plus forte) | TF_VAR_ env variable | \`export TF_VAR_region="us-east-1"\` |

### Variables d'environnement

\`\`\`bash
# Définir des variables via l'environnement
export TF_VAR_region="eu-west-3"
export TF_VAR_environment="prod"
export TF_VAR_db_password="super-secret"

# Terraform les détecte automatiquement
terraform plan
\`\`\`

## Outputs (Sorties)

Les **outputs** exposent des informations sur votre infrastructure après le déploiement.

### Déclaration des outputs

\`\`\`hcl
# outputs.tf

output "vpc_id" {
  description = "L'ID du VPC créé"
  value       = aws_vpc.main.id
}

output "public_ip" {
  description = "L'adresse IP publique de l'instance"
  value       = aws_instance.web.public_ip
}

# Output sensible
output "db_connection_string" {
  description = "Chaîne de connexion à la base de données"
  value       = "postgresql://\${var.db_user}:\${var.db_password}@\${aws_db_instance.main.endpoint}/\${var.db_name}"
  sensitive   = true
}

# Output conditionnel
output "lb_dns_name" {
  description = "DNS du load balancer (si activé)"
  value       = var.enable_lb ? aws_lb.main[0].dns_name : null
}

# Output complexe
output "instance_details" {
  description = "Détails des instances créées"
  value = {
    for instance in aws_instance.web :
    instance.tags.Name => {
      id         = instance.id
      public_ip  = instance.public_ip
      private_ip = instance.private_ip
      az         = instance.availability_zone
    }
  }
}
\`\`\`

### Utiliser les outputs

\`\`\`bash
# Afficher tous les outputs
terraform output

# Afficher un output spécifique
terraform output vpc_id

# Format JSON (utile en CI/CD)
terraform output -json

# Afficher un output sensible
terraform output -raw db_connection_string
\`\`\`

## Local Values (Valeurs locales)

Les **locals** permettent de définir des expressions réutilisables dans votre configuration.

\`\`\`hcl
# locals.tf
locals {
  # Tags communs
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Team        = var.team
    CreatedAt   = timestamp()
  }

  # Nom avec préfixe environnement
  name_prefix = "\${var.project_name}-\${var.environment}"

  # Calcul conditionnel
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"

  # Transformation de données
  subnet_ids = [for s in aws_subnet.main : s.id]

  # Fusion de maps
  all_tags = merge(local.common_tags, var.extra_tags)

  # Filtrage
  public_subnets = [
    for s in var.subnets : s if s.public == true
  ]
}

# Utilisation
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = local.instance_type
  subnet_id     = local.subnet_ids[0]

  tags = merge(local.all_tags, {
    Name = "\${local.name_prefix}-web"
    Role = "webserver"
  })
}

resource "aws_s3_bucket" "assets" {
  bucket = "\${local.name_prefix}-assets"
  tags   = local.all_tags
}
\`\`\`

## Expressions et fonctions utiles

\`\`\`hcl
locals {
  # Fonctions de chaîne
  upper_env   = upper(var.environment)            # "PROD"
  joined      = join("-", ["web", var.environment]) # "web-prod"
  trimmed     = trimspace("  hello  ")            # "hello"

  # Fonctions de collection
  flat_list   = flatten([["a", "b"], ["c"]])      # ["a", "b", "c"]
  distinct    = distinct(["a", "b", "a"])         # ["a", "b"]
  keys_list   = keys(var.instance_types)          # ["dev", "staging", "prod"]

  # Fonctions numériques
  max_val     = max(5, 12, 9)                     # 12
  min_val     = min(5, 12, 9)                     # 5

  # Fonctions de fichier
  user_data   = file("\${path.module}/scripts/init.sh")
  config_json = jsonencode({ app = "web", port = 8080 })

  # Conditionnels
  env_suffix  = var.environment == "prod" ? "" : "-\${var.environment}"

  # Boucles for
  instance_names = [for i in range(var.instance_count) : "web-\${i + 1}"]
}
\`\`\`

## Exercice pratique

> **Exercice** : Créez une configuration paramétrable avec variables, locals et outputs.

1. Définissez les variables suivantes avec validation :
   - \`environment\` (dev/staging/prod)
   - \`instance_count\` (entre 1 et 10)
   - \`instance_type\` (famille t2 ou t3 uniquement)

2. Utilisez des locals pour :
   - Calculer un préfixe de nommage
   - Définir les tags communs
   - Sélectionner le type d'instance selon l'environnement

3. Créez des outputs pour exposer :
   - Les IPs des instances
   - Le nombre total de ressources créées

\`\`\`bash
# Testez avec différents fichiers tfvars
terraform plan -var-file="environments/dev.tfvars"
terraform plan -var-file="environments/prod.tfvars"
\`\`\`
`;


export const terraformModules = `# Modules Terraform

## Qu'est-ce qu'un module ?

Un **module** Terraform est un ensemble de fichiers \`.tf\` regroupés dans un répertoire. Les modules permettent de :

- **Réutiliser** du code d'infrastructure
- **Encapsuler** la complexité
- **Standardiser** les déploiements
- **Partager** des configurations entre équipes

### Le module racine (root module)

Chaque configuration Terraform est un module. Le répertoire principal est le **root module**.

\`\`\`
mon-projet/
├── main.tf          ← Root module
├── variables.tf
├── outputs.tf
└── modules/
    ├── vpc/         ← Module enfant
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── ec2/         ← Module enfant
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
\`\`\`

## Créer un module

### Structure d'un module

\`\`\`
modules/vpc/
├── main.tf          # Ressources du module
├── variables.tf     # Variables d'entrée du module
├── outputs.tf       # Outputs du module
├── versions.tf      # Contraintes de versions
└── README.md        # Documentation
\`\`\`

### Exemple : Module VPC

\`\`\`hcl
# modules/vpc/variables.tf
variable "vpc_cidr" {
  description = "Bloc CIDR du VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Nom de l'environnement"
  type        = string
}

variable "public_subnets" {
  description = "Liste des CIDR pour les subnets publics"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "Liste des CIDR pour les subnets privés"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "availability_zones" {
  description = "Liste des zones de disponibilité"
  type        = list(string)
}
\`\`\`

\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "\${var.environment}-public-\${count.index + 1}"
    Environment = var.environment
    Type        = "public"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnets)

  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "\${var.environment}-private-\${count.index + 1}"
    Environment = var.environment
    Type        = "private"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "\${var.environment}-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "\${var.environment}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
\`\`\`

\`\`\`hcl
# modules/vpc/outputs.tf
output "vpc_id" {
  description = "L'ID du VPC"
  value       = aws_vpc.this.id
}

output "vpc_cidr" {
  description = "Le bloc CIDR du VPC"
  value       = aws_vpc.this.cidr_block
}

output "public_subnet_ids" {
  description = "Les IDs des subnets publics"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Les IDs des subnets privés"
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "L'ID de l'Internet Gateway"
  value       = aws_internet_gateway.this.id
}
\`\`\`

### Appeler le module

\`\`\`hcl
# main.tf (root module)
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr           = "10.0.0.0/16"
  environment        = "production"
  public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets    = ["10.0.10.0/24", "10.0.11.0/24"]
  availability_zones = ["eu-west-3a", "eu-west-3b"]
}

# Utiliser les outputs du module
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = module.vpc.public_subnet_ids[0]

  tags = {
    Name = "web-server"
  }
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
\`\`\`

## Sources de modules

### Modules locaux

\`\`\`hcl
module "vpc" {
  source = "./modules/vpc"
}

module "shared" {
  source = "../shared-modules/networking"
}
\`\`\`

### Terraform Registry

\`\`\`hcl
# Module officiel de la registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "mon-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Environment = "production"
  }
}
\`\`\`

### Git (GitHub, GitLab, Bitbucket)

\`\`\`hcl
# HTTPS
module "vpc" {
  source = "git::https://github.com/mon-org/terraform-modules.git//vpc?ref=v1.2.0"
}

# SSH
module "vpc" {
  source = "git::ssh://git@github.com/mon-org/terraform-modules.git//vpc?ref=main"
}

# Avec un tag spécifique
module "vpc" {
  source = "github.com/mon-org/terraform-modules//vpc?ref=v2.0.0"
}
\`\`\`

### S3 / GCS

\`\`\`hcl
module "vpc" {
  source = "s3::https://s3-eu-west-3.amazonaws.com/mon-bucket/modules/vpc.zip"
}

module "vpc" {
  source = "gcs::https://www.googleapis.com/storage/v1/modules/vpc.zip"
}
\`\`\`

## Composition de modules

### Architecture multi-couches

\`\`\`hcl
# main.tf - Composition de plusieurs modules

# Couche réseau
module "networking" {
  source = "./modules/networking"

  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

# Couche sécurité
module "security" {
  source = "./modules/security"

  vpc_id      = module.networking.vpc_id
  environment = var.environment
}

# Couche compute
module "compute" {
  source = "./modules/compute"

  subnet_ids         = module.networking.public_subnet_ids
  security_group_ids = [module.security.web_sg_id]
  environment        = var.environment
  instance_count     = var.instance_count
}

# Couche base de données
module "database" {
  source = "./modules/database"

  subnet_ids         = module.networking.private_subnet_ids
  security_group_ids = [module.security.db_sg_id]
  environment        = var.environment
}
\`\`\`

### Modules avec for_each

\`\`\`hcl
variable "environments" {
  default = {
    dev = {
      instance_type = "t3.micro"
      count         = 1
    }
    staging = {
      instance_type = "t3.small"
      count         = 2
    }
    prod = {
      instance_type = "t3.medium"
      count         = 3
    }
  }
}

module "app" {
  for_each = var.environments
  source   = "./modules/app"

  environment   = each.key
  instance_type = each.value.instance_type
  instance_count = each.value.count
}
\`\`\`

## Terraform Registry

Le [Terraform Registry](https://registry.terraform.io) est le dépôt officiel de modules et providers.

### Modules populaires

| Module | Description | Source |
|--------|-------------|--------|
| terraform-aws-modules/vpc | VPC AWS complet | Registry officielle |
| terraform-aws-modules/eks | Cluster EKS | Registry officielle |
| terraform-aws-modules/rds | Base de données RDS | Registry officielle |
| terraform-aws-modules/s3-bucket | Bucket S3 | Registry officielle |

### Publier un module

Pour publier un module sur la Registry :

1. **Convention de nommage** : \`terraform-<PROVIDER>-<NOM>\`
2. **Structure requise** :

\`\`\`
terraform-aws-mon-module/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
├── README.md
├── examples/
│   ├── simple/
│   │   └── main.tf
│   └── complete/
│       └── main.tf
└── modules/
    └── sous-module/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
\`\`\`

3. **Héberger sur GitHub** avec des tags de version sémantique

\`\`\`bash
git tag v1.0.0
git push origin v1.0.0
\`\`\`

## Versioning des modules

### Contraintes de version

\`\`\`hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"        # Version exacte
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"       # >= 5.0, < 6.0
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = ">= 5.0, < 5.5" # Entre 5.0 et 5.5
}
\`\`\`

### Bonnes pratiques de versioning

| Pratique | Description |
|----------|-------------|
| Utiliser des versions exactes en prod | Évite les surprises |
| Utiliser \`~>\` pour les non-critiques | Mises à jour mineures auto |
| Tester avant mise à jour | Valider en staging d'abord |
| Documenter les changements | Maintenir un CHANGELOG |
| Utiliser le lock file | \`.terraform.lock.hcl\` |

## Exercice pratique

> **Exercice** : Créez un module réutilisable et appelez-le plusieurs fois.

1. Créez un module \`modules/webserver\` qui provisionne :
   - Un security group (HTTP + SSH)
   - Une ou plusieurs instances EC2
   - Un output avec les IPs

2. Appelez ce module pour 3 environnements différents :

\`\`\`hcl
module "web_dev" {
  source        = "./modules/webserver"
  environment   = "dev"
  instance_count = 1
  instance_type = "t3.micro"
}

module "web_staging" {
  source        = "./modules/webserver"
  environment   = "staging"
  instance_count = 2
  instance_type = "t3.small"
}

module "web_prod" {
  source        = "./modules/webserver"
  environment   = "prod"
  instance_count = 3
  instance_type = "t3.medium"
}
\`\`\`

3. Utilisez un module de la Terraform Registry (par ex. \`terraform-aws-modules/vpc/aws\`)
`;


export const terraformState = `# Gestion du State et Workspaces

## Comprendre le State Terraform

Le **state** (état) est le fichier qui fait le lien entre votre configuration Terraform et les ressources réelles déployées dans le cloud. Sans ce fichier, Terraform ne sait pas quelles ressources il gère.

### Rôle du state

- **Mapper** les ressources de la configuration aux ressources réelles
- **Suivre** les métadonnées (dépendances, attributs)
- **Optimiser** les performances (cache des attributs)
- **Coordonner** le travail en équipe (locking)

### Problèmes du state local

| Problème | Description |
|----------|-------------|
| Pas de collaboration | Un seul développeur peut travailler |
| Pas de locking | Risque de corruption en parallèle |
| Pas de sécurité | Données sensibles en clair sur le disque |
| Pas de backup | Perte de données en cas de crash |

## Remote State

Le **remote state** stocke le fichier d'état sur un backend distant partagé.

### Backend S3 (AWS)

\`\`\`hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "mon-projet-terraform-state"
    key            = "production/infrastructure/terraform.tfstate"
    region         = "eu-west-3"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

Création du bucket et de la table DynamoDB (bootstrap) :

\`\`\`hcl
# bootstrap/main.tf - À exécuter une seule fois avec un state local
provider "aws" {
  region = "eu-west-3"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "mon-projet-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "Terraform State Lock Table"
  }
}
\`\`\`

### Backend Azure Blob Storage

\`\`\`hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "stterraformstate"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
  }
}
\`\`\`

Configuration Azure :

\`\`\`bash
# Créer le resource group
az group create --name rg-terraform-state --location francecentral

# Créer le storage account
az storage account create \\
  --name stterraformstate \\
  --resource-group rg-terraform-state \\
  --location francecentral \\
  --sku Standard_LRS \\
  --encryption-services blob

# Créer le container
az storage container create \\
  --name tfstate \\
  --account-name stterraformstate
\`\`\`

### Backend GCS (Google Cloud Storage)

\`\`\`hcl
terraform {
  backend "gcs" {
    bucket = "mon-projet-terraform-state"
    prefix = "production/infrastructure"
  }
}
\`\`\`

### Comparaison des backends

| Backend | Locking | Chiffrement | Versioning | Coût |
|---------|---------|-------------|------------|------|
| S3 + DynamoDB | ✅ DynamoDB | ✅ KMS | ✅ S3 | Faible |
| Azure Blob | ✅ Natif | ✅ Natif | ✅ Natif | Faible |
| GCS | ✅ Natif | ✅ Natif | ✅ Natif | Faible |
| Terraform Cloud | ✅ Natif | ✅ Natif | ✅ Natif | Gratuit/Payant |
| Consul | ✅ Natif | ⚠️ Config | ❌ | Gratuit |

## State Locking

Le **locking** empêche deux personnes de modifier le state simultanément.

\`\`\`bash
# Le lock est automatique avec les backends supportés
terraform plan   # Acquiert le lock
terraform apply  # Acquiert le lock

# Forcer le déverrouillage (en cas de crash)
terraform force-unlock LOCK_ID

# Désactiver le locking (déconseillé)
terraform plan -lock=false
\`\`\`

### Comportement du lock

\`\`\`
Développeur A                    Développeur B
     │                                │
     ├─── terraform apply ───┐        │
     │    (acquiert le lock)  │        │
     │                        │        ├─── terraform plan
     │    ... déploiement ... │        │    ❌ Error: state locked
     │                        │        │    Lock ID: abc-123
     ├─── (relâche le lock) ──┘        │    Locked by: Dev A
     │                                 │
     │                                 ├─── terraform plan ✅
     │                                 │
\`\`\`

## Workspaces

Les **workspaces** permettent de gérer plusieurs environnements avec la même configuration.

### Commandes workspace

\`\`\`bash
# Lister les workspaces
terraform workspace list

# Créer un nouveau workspace
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Changer de workspace
terraform workspace select prod

# Afficher le workspace courant
terraform workspace show

# Supprimer un workspace
terraform workspace delete dev
\`\`\`

### Utiliser le workspace dans la configuration

\`\`\`hcl
# Le workspace courant est accessible via terraform.workspace
locals {
  environment = terraform.workspace

  instance_type = {
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.large"
  }

  instance_count = {
    dev     = 1
    staging = 2
    prod    = 3
  }
}

resource "aws_instance" "web" {
  count         = local.instance_count[local.environment]
  ami           = data.aws_ami.ubuntu.id
  instance_type = local.instance_type[local.environment]

  tags = {
    Name        = "web-\${local.environment}-\${count.index + 1}"
    Environment = local.environment
  }
}
\`\`\`

### Organisation du state avec workspaces

\`\`\`
s3://mon-bucket-state/
├── env:/
│   ├── dev/
│   │   └── terraform.tfstate
│   ├── staging/
│   │   └── terraform.tfstate
│   └── prod/
│       └── terraform.tfstate
└── terraform.tfstate  (workspace default)
\`\`\`

### Workspaces vs répertoires séparés

| Critère | Workspaces | Répertoires séparés |
|---------|-----------|---------------------|
| Simplicité | ✅ Une seule config | ❌ Duplication possible |
| Isolation | ⚠️ Même backend | ✅ Backends séparés |
| Différences entre envs | ⚠️ Limité aux variables | ✅ Configs différentes |
| CI/CD | ⚠️ Plus complexe | ✅ Plus explicite |
| Cas d'usage | Envs similaires | Envs très différents |

## Importer des ressources existantes

### terraform import

Permet d'importer une ressource existante dans le state Terraform.

\`\`\`bash
# Syntaxe
terraform import <ADRESSE_RESSOURCE> <ID_RESSOURCE>

# Exemples
terraform import aws_instance.web i-0abc123def456789
terraform import aws_vpc.main vpc-0abc123def
terraform import aws_security_group.web sg-0abc123def
terraform import aws_s3_bucket.assets mon-bucket-assets
\`\`\`

### Workflow d'import

\`\`\`bash
# 1. Écrire le bloc resource dans la configuration
# (sans les arguments, juste le bloc vide)

# 2. Importer la ressource
terraform import aws_instance.web i-0abc123def456789

# 3. Vérifier l'état importé
terraform show

# 4. Compléter la configuration avec les attributs
terraform plan  # Doit montrer "No changes"
\`\`\`

### Import block (Terraform >= 1.5)

\`\`\`hcl
# import.tf - Méthode déclarative (recommandée)
import {
  to = aws_instance.web
  id = "i-0abc123def456789"
}

import {
  to = aws_vpc.main
  id = "vpc-0abc123def"
}

# Générer la configuration automatiquement
# terraform plan -generate-config-out=generated.tf
\`\`\`

\`\`\`bash
# Générer le code HCL automatiquement
terraform plan -generate-config-out=generated.tf

# Vérifier et ajuster le code généré
# Puis appliquer
terraform apply
\`\`\`

## Commandes de manipulation du state

### terraform state list

\`\`\`bash
# Lister toutes les ressources
terraform state list

# Filtrer par type
terraform state list aws_instance
terraform state list module.vpc
\`\`\`

### terraform state show

\`\`\`bash
# Afficher les détails d'une ressource
terraform state show aws_instance.web
terraform state show module.vpc.aws_subnet.public[0]
\`\`\`

### terraform state mv

Renomme ou déplace une ressource dans le state.

\`\`\`bash
# Renommer une ressource
terraform state mv aws_instance.web aws_instance.webserver

# Déplacer dans un module
terraform state mv aws_instance.web module.compute.aws_instance.web

# Déplacer entre modules
terraform state mv module.old.aws_instance.web module.new.aws_instance.web
\`\`\`

### terraform state rm

Supprime une ressource du state (sans la détruire dans le cloud).

\`\`\`bash
# Retirer une ressource du state
terraform state rm aws_instance.web

# Retirer un module entier
terraform state rm module.vpc

# La ressource existe toujours dans le cloud
# mais Terraform ne la gère plus
\`\`\`

### terraform state pull / push

\`\`\`bash
# Télécharger le state distant en local
terraform state pull > state.json

# Envoyer un state local vers le backend distant
terraform state push state.json

# ⚠️ Utiliser push avec précaution !
\`\`\`

### terraform state replace-provider

\`\`\`bash
# Changer le provider d'une ressource dans le state
terraform state replace-provider hashicorp/aws registry.example.com/aws
\`\`\`

## Moved blocks (Terraform >= 1.1)

\`\`\`hcl
# Refactoring sans perdre les ressources
moved {
  from = aws_instance.web
  to   = aws_instance.webserver
}

moved {
  from = aws_instance.web
  to   = module.compute.aws_instance.web
}

moved {
  from = module.old_vpc
  to   = module.networking
}
\`\`\`

## Bonnes pratiques de gestion du state

| Pratique | Description |
|----------|-------------|
| **Remote state** obligatoire | Toujours en équipe |
| **Locking** activé | Éviter les corruptions |
| **Chiffrement** activé | Données sensibles dans le state |
| **Versioning** du bucket | Rollback possible |
| **Séparer les states** | Par environnement / couche |
| **Limiter les accès** | IAM policies restrictives |
| **Éviter state rm/mv** | Utiliser moved blocks |
| **Backups réguliers** | Automatisés avec versioning |

## Data source terraform_remote_state

Permet de lire les outputs d'un autre state Terraform.

\`\`\`hcl
# Lire le state de l'infrastructure réseau
data "terraform_remote_state" "networking" {
  backend = "s3"

  config = {
    bucket = "mon-projet-terraform-state"
    key    = "networking/terraform.tfstate"
    region = "eu-west-3"
  }
}

# Utiliser les outputs du state distant
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = data.terraform_remote_state.networking.outputs.public_subnet_ids[0]

  vpc_security_group_ids = [
    data.terraform_remote_state.networking.outputs.web_sg_id
  ]
}
\`\`\`

## Exercice pratique

> **Exercice** : Configurez un remote state et pratiquez les commandes de manipulation.

1. Créez un backend S3 avec locking DynamoDB :

\`\`\`bash
# Créez d'abord le bucket et la table (bootstrap)
aws s3api create-bucket --bucket mon-state-bucket --region eu-west-3 \\
  --create-bucket-configuration LocationConstraint=eu-west-3

aws dynamodb create-table --table-name terraform-locks \\
  --attribute-definitions AttributeName=LockID,AttributeType=S \\
  --key-schema AttributeName=LockID,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST
\`\`\`

2. Migrez un state local vers S3 :

\`\`\`bash
# Ajoutez le backend dans votre configuration
# Puis réinitialisez
terraform init -migrate-state
\`\`\`

3. Pratiquez les workspaces :

\`\`\`bash
terraform workspace new dev
terraform apply -var-file="dev.tfvars"

terraform workspace new prod
terraform apply -var-file="prod.tfvars"

terraform workspace list
\`\`\`

4. Importez une ressource existante :

\`\`\`bash
# Créez une ressource manuellement dans la console AWS
# Puis importez-la dans Terraform
terraform import aws_s3_bucket.existing nom-du-bucket
terraform plan  # Ajustez la config jusqu'à "No changes"
\`\`\`
`;
