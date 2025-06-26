# Monorepo Vite + Vue 3 + Express

## Structure du projet

```
/formation-vue3-av-fil-rouge
│
├── client/         # Application front-end Vue 3 (Vite)
│   └── src/
│       ├── components/   # Composants Vue réutilisables
│       ├── views/        # Pages principales (vues)
│       ├── router/       # Configuration Vue Router (history, hooks)
│       ├── stores/       # Pinia (state management)
│       └── composables/  # Fonctions réutilisables (composables Vue 3)
│
├── server/         # API Express + SQLite + endpoints fixtures
│   ├── index.js    # Point d'entrée serveur
│   └── database.sqlite  # (créé automatiquement)
│
└── README.md       # Ce fichier
```

## Scripts

### Côté client (Vite + Vue 3)
```bash
cd client
npm install      # Installer les dépendances
npm run dev      # Lancer le serveur de dev (http://localhost:5173)
npm run build    # Build de production
npm run start    # Preview du build
```

### Côté serveur (Express + SQLite)
```bash
cd server
npm install      # Installer les dépendances
npm run dev      # Lancer le serveur en mode dev (http://localhost:3001)
npm start        # Lancer en mode production
```

## Endpoints API disponibles

### Gestion des profils (SQLite réelle)
- `GET    /api/profiles` → liste tous les profils
- `GET    /api/profiles/:id` → récupère un profil par ID
- `POST   /api/profiles` → crée un nouveau profil
- `PUT    /api/profiles/:id` → met à jour complètement un profil
- `PATCH  /api/profiles/:id` → met à jour partiellement un profil
- `DELETE /api/profiles/:id` → supprime un profil
- `GET    /api/profiles/search/:email` → recherche un profil par email

### Autres endpoints
- `POST   /api/login` → `{ token, role }` (stub)
- `GET    /api/users/:id` → utilisateur fictif
- `GET    /api/products/:productId` → produit fictif
- `GET    /api/blog/:postId` → article fictif
- `GET    /api/blog/:postId/comments` → commentaires fictifs
- `GET    /api/dashboard/widgets` → widgets fictifs
- `GET    /api/map-data` → données géographiques simulées
- `GET    /api/cart` → contenu du panier (en mémoire)
- `POST   /api/cart` → ajoute un item au panier
- `GET    /api/secret` → protégé, nécessite un header Authorization
- `GET|POST|PUT|DELETE /api/items` → CRUD sur une table SQLite réelle

## Ajouter des composants Vue 3

- Place tes composants dans `client/src/components/` (ex: `MonComposant.vue`)
- Ajoute tes vues dans `client/src/views/` et référence-les dans le routeur (`client/src/router/index.js`)
- Crée des stores Pinia dans `client/src/stores/`
- Crée des composables dans `client/src/composables/`
- Utilise `<Suspense>` et `defineAsyncComponent` pour le chargement asynchrone
- Les hooks de navigation sont déjà en place dans le routeur (à compléter selon les besoins)

## Conseils pour consommer l'API

- Utilise `fetch` ou `axios` dans tes composants ou composables pour appeler les endpoints du serveur Express
- Exemple pour récupérer les items :

```js
fetch('http://localhost:3001/api/items')
  .then(res => res.json())
  .then(data => console.log(data));
```

- Exemple pour créer un profil :

```js
const newProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '0123456789',
  address: '123 Rue de la Paix, Paris',
  bio: 'Développeur passionné',
  birthDate: '1990-01-15'
};

fetch('http://localhost:3001/api/profiles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newProfile)
})
.then(res => res.json())
.then(data => console.log(data));
```

## Démarrage rapide

1. Ouvre deux terminaux :
   - Terminal 1 :
     ```bash
     cd server
     npm install
     npm run dev
     ```
   - Terminal 2 :
     ```bash
     cd client
     npm install
     npm run dev
     ```
2. Accède à l'interface sur http://localhost:5173
3. Les appels API sont disponibles sur http://localhost:3001

---

**Prêt à coder !** Ajoute tes composants, vues, stores et consomme l'API pour t'entraîner sur un vrai projet fullstack moderne.