# Cluedo - Windows OS Simulation

[![Status](https://img.shields.io/website?url=https%3A%2F%2F35mm.hugo-pinchemel.fr%2F&label=Status)](https://35mm.hugo-pinchemel.fr/)
[![Deploy](https://github.com/Hugopinchemel/cluedo/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hugopinchemel/cluedo/actions/workflows/deploy.yml)

Ce projet est une simulation web d'une interface de système d'exploitation Windows 10/11 construite avec **Nuxt 4**, *
*Vue 3** et **SCSS**.

Consultez la [documentation Nuxt](https://nuxt.com/docs/getting-started/introduction) pour en savoir plus.

## Configuration (Setup)

Assurez-vous d'installer les dépendances :

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Serveur de Développement

Démarrez le serveur de développement sur `http://localhost:3000` :

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Construisez l'application pour la production :

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Aperçu local de la version de production :

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Côté Serveur (Déploiement)

L'application est configurée avec **Nuxt 4** et peut être déployée sur n'importe quel environnement supportant Node.js.

### Construction de l'application

Avant de lancer le serveur, vous devez construire l'application pour la production :

```bash
npm run build
```

### Lancement du serveur

Une fois la construction terminée, le dossier `.output` est généré. Pour lancer le serveur de production :

```bash
node .output/server/index.mjs
```

### Recommandations pour le serveur

- **Gestionnaire de processus :** Il est fortement recommandé d'utiliser **PM2** pour maintenir l'application en ligne
  et gérer les redémarrages automatiques.
  ```bash
  pm2 start .output/server/index.mjs --name "cluedo-windows"
  ```
- **Proxy Inverse :** Utilisez **Nginx** ou **Apache** comme proxy inverse devant le serveur Nuxt (port 3000 par
  défaut).
- **Variables d'Environnement :** Vous pouvez configurer les variables nécessaires (comme `PORT` ou `HOST`) via un
  fichier `.env`.

Consultez la [documentation de déploiement](https://nuxt.com/docs/getting-started/deployment) pour plus d'informations.

## Déploiement Automatique (CI/CD)

Le projet est configuré pour un déploiement automatique via **GitHub Actions** à chaque push sur la branche `main`.

### Configuration des Secrets GitHub

Pour activer l'auto-déploiement, vous devez configurer les **GitHub Actions Secrets** suivants dans votre dépôt (
`Settings > Secrets and variables > Actions`) :

- `SERVER_HOST` : L'adresse IP ou le nom d'hôte de votre serveur (ex: `35mm.hugo-pinchemel.fr`).
- `SERVER_USER` : L'utilisateur SSH (ex: `root`).
- `SSH_PRIVATE_KEY` : Votre clé privée SSH pour se connecter au serveur.

### Workflow

Le fichier de configuration se trouve dans `.github/workflows/deploy.yml`. Il effectue les actions suivantes sur le
serveur :

1. `git pull` : Récupère la dernière version du code.
2. `npm install` : Installe/met à jour les dépendances.
3. `npm run build` : Construit l'application pour la production.
4. `pm2 restart` : Recharge l'application sans interruption de service.
