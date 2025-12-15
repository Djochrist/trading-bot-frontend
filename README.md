# Trading Bot Dashboard

Dashboard de suivi en temps réel pour bot de trading algorithmique.

---

## Table des Matières

1. [Aperçu du Projet](#aperçu-du-projet)
2. [Architecture](#architecture)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Structure des Fichiers](#structure-des-fichiers)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Lancement en Local](#lancement-en-local)
8. [Connexion au Backend](#connexion-au-backend)
9. [Format des Données API](#format-des-données-api)
10. [Déploiement](#déploiement)
11. [Personnalisation](#personnalisation)
12. [Dépannage](#dépannage)

---

## Aperçu du Projet

Ce projet est une **interface web frontend** conçue pour afficher les performances d'un bot de trading. Elle se connecte à un backend externe (Flask, Node.js, ou autre) qui expose une API REST.

### Fonctionnalités Principales

- **Affichage des métriques clés** : Capital total, P&L, positions ouvertes, taux de réussite
- **Liste des trades récents** : Positions long/short avec prix d'entrée et P&L
- **Mise à jour automatique** : Polling toutes les 5 secondes
- **Design responsive** : Fonctionne sur desktop, tablette et mobile
- **Thème financier** : Interface claire avec codes couleurs vert (gains) / rouge (pertes)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                   (Ce projet - React)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Navbar     │  │ Performance  │  │   Trades     │       │
│  │  Component   │  │    Cards     │  │    List      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                           │                                  │
│                    fetch() toutes les 5s                     │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│              (Votre bot Flask/Python)                        │
│                                                              │
│  Endpoint: GET /api/dashboard                                │
│  Retourne: { metrics: [...], trades: [...] }                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Technologies Utilisées

| Technologie | Rôle |
|-------------|------|
| **React 19** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Styling utilitaire |
| **Wouter** | Routing léger |
| **Lucide React** | Icônes |
| **TanStack Query** | Gestion du cache (disponible) |

---

## Structure des Fichiers

```
├── client/
│   ├── index.html              # Point d'entrée HTML
│   ├── src/
│   │   ├── main.tsx            # Bootstrap React
│   │   ├── App.tsx             # Router principal
│   │   ├── index.css           # Thème et variables CSS
│   │   ├── components/
│   │   │   ├── Navbar.tsx      # Barre de navigation
│   │   │   ├── PerformanceCard.tsx  # Carte KPI
│   │   │   └── StatusCard.tsx  # (Non utilisé)
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Page principale du dashboard
│   │   │   └── not-found.tsx   # Page 404
│   │   ├── lib/
│   │   │   ├── utils.ts        # Utilitaires (cn, etc.)
│   │   │   └── queryClient.ts  # Configuration TanStack Query
│   │   └── hooks/              # Hooks personnalisés
├── server/                     # Backend Express (non utilisé ici)
├── shared/                     # Schémas partagés
├── package.json
├── vite.config.ts
└── README.md
```

---

## Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd trading-bot-dashboard

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5000`

---

## Configuration

### Variable d'Environnement

La seule configuration nécessaire est l'URL de votre backend :

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL complète de l'endpoint API | `http://localhost:8080/api/dashboard` |

**En local** : Pas besoin de configurer, utilise localhost:8080 par défaut.

**En production** : Créez un fichier `.env` ou configurez dans votre hébergeur :

```bash
VITE_API_URL=https://votre-backend.cleverapps.io/api/dashboard
```

---

## Lancement en Local

### Frontend uniquement (ce projet)

```bash
npm run dev
```

### Backend (votre bot Flask)

```bash
python main.py
```

Votre Flask doit tourner sur le port 8080 avec CORS activé.

---

## Connexion au Backend

### Endpoint Requis

Le frontend appelle un seul endpoint :

```
GET /api/dashboard
```

### Réponse Attendue

```json
{
  "metrics": [
    {
      "id": "1",
      "label": "Capital Total",
      "value": "12450.00 €",
      "trend": "up",
      "trendValue": "+2.4%",
      "subtext": "vs hier",
      "icon": "Wallet"
    },
    {
      "id": "2",
      "label": "Position Actuelle",
      "value": "LONG",
      "trend": "neutral",
      "subtext": "open",
      "icon": "Activity"
    }
  ],
  "trades": [
    {
      "id": "t1",
      "pair": "BTC/USDT",
      "type": "long",
      "entry": 42100,
      "current": 42350,
      "pnl": 250,
      "status": "open",
      "time": "10:42"
    }
  ]
}
```

---

## Format des Données API

### Objet Metric

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `id` | string | Oui | Identifiant unique |
| `label` | string | Oui | Nom affiché (ex: "Capital Total") |
| `value` | string/number | Oui | Valeur affichée |
| `trend` | "up"/"down"/"neutral" | Non | Direction de la tendance |
| `trendValue` | string | Non | Valeur du changement (ex: "+2.4%") |
| `subtext` | string | Non | Texte secondaire |
| `icon` | string | Non | Nom de l'icône: "Wallet", "Activity", "DollarSign", "Percent" |

### Objet Trade

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `id` | string | Oui | Identifiant unique |
| `pair` | string | Oui | Paire de trading (ex: "BTC/USDT") |
| `type` | "long"/"short" | Oui | Direction du trade |
| `entry` | number | Oui | Prix d'entrée |
| `current` | number | Non | Prix actuel |
| `pnl` | number | Oui | Profit/Loss en valeur |
| `status` | "open"/"closed" | Non | État du trade |
| `time` | string | Non | Heure du trade |

---

## Déploiement

### Option 1 : Clever Cloud

**1. Build du frontend :**
```bash
npm run build
```

**2. Créer une app Node.js sur Clever Cloud**

**3. Configurer les variables d'environnement :**
```
VITE_API_URL=https://votre-backend.cleverapps.io/api/dashboard
```

**4. Pousser le code :**
```bash
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/<app-id>.git
git push clever main
```

### Option 2 : Vercel / Netlify

```bash
npm run build
# Déployer le dossier dist/public
```

### Option 3 : Serveur statique

Les fichiers buildés dans `dist/public` peuvent être servis par nginx, Apache, ou tout CDN.

---

## Personnalisation

### Modifier les Couleurs

Éditez `client/src/index.css` :

```css
@theme inline {
  --color-primary: hsl(150 100% 35%);  /* Vert trading */
  --color-destructive: hsl(0 84% 60%); /* Rouge pertes */
}
```

### Ajouter une Métrique

Dans votre backend, ajoutez un objet au tableau `metrics` :

```python
{
    "id": "3",
    "label": "Win Rate",
    "value": "68.5%",
    "trend": "up",
    "trendValue": "+3%",
    "icon": "Percent"
}
```

### Changer la Fréquence de Polling

Dans `client/src/pages/Home.tsx`, ligne ~111 :

```typescript
const intervalId = setInterval(fetchTradingData, 5000); // 5000ms = 5s
```

### Icônes Disponibles

Le frontend supporte ces icônes (à envoyer comme string depuis le backend) :
- `Wallet` - Portefeuille
- `Activity` - Activité/Positions
- `DollarSign` - Argent/P&L
- `Percent` - Pourcentages

---

## Dépannage

### Le dashboard ne charge pas les données

1. **Vérifiez que votre backend tourne** :
   ```bash
   curl http://localhost:8080/api/dashboard
   ```

2. **Vérifiez CORS** dans votre Flask :
   ```python
   from flask_cors import CORS
   CORS(app)
   ```

3. **Vérifiez la console du navigateur** (F12) pour les erreurs.

### Erreur "Failed to fetch"

- Le backend n'est pas accessible
- L'URL est incorrecte
- CORS bloque la requête

### Les données s'affichent mais sont vides

Votre backend retourne des tableaux vides. Vérifiez :
- `bot.capital` existe
- `bot.trade_history` contient des trades

### Erreur TypeScript au build

```bash
npm run check
```

Corrigez les erreurs de typage avant de builder.

---

## Exemple de Backend Flask Minimal

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/dashboard")
def dashboard():
    return jsonify({
        "metrics": [
            {"id": "1", "label": "Capital", "value": "10000 €", "trend": "neutral", "icon": "Wallet"},
        ],
        "trades": []
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

---

## Licence

MIT

---

## Support

Pour toute question, ouvrez une issue sur le dépôt GitHub.
