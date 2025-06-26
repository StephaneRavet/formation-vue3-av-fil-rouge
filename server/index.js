const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation de la base SQLite
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur ouverture DB:', err.message);
  } else {
    console.log('Connecté à SQLite');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
});

// Middleware pour simuler la latence
app.use((req, res, next) => {
  const delay = Math.random() * 1000 + 300; // 300ms à 1300ms
  setTimeout(next, delay);
});

// Middleware pour simuler un timeout aléatoire
app.use((req, res, next) => {
  if (Math.random() < 0.1) { // 10% de chance de timeout
    setTimeout(() => {
      res.status(504).json({ error: 'Timeout simulé' });
    }, 2000);
  } else {
    next();
  }
});

// GET all items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET item by id
app.get('/api/items/:id', (req, res) => {
  db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// POST create item
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.run('INSERT INTO items (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.run('UPDATE items SET name = ? WHERE id = ?', [name, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ id: req.params.id, name });
  });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  db.run('DELETE FROM items WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });
});

// --- API fixtures ---

// Authentification (stub)
app.post('/api/login', (req, res) => {
  res.json({ token: 'fake-jwt', role: 'user' });
});

// Utilisateur fictif
app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'John Doe', email: 'john.doe@example.com' });
});

// Produit fictif
app.get('/api/products/:productId', (req, res) => {
  res.json({ id: req.params.productId, name: 'Produit Test', price: 42.99 });
});

// Article de blog fictif
app.get('/api/blog/:postId', (req, res) => {
  res.json({ id: req.params.postId, title: 'Article Test', content: 'Contenu fictif', author: 'Auteur' });
});

// Commentaires fictifs d'un article
app.get('/api/blog/:postId/comments', (req, res) => {
  res.json([
    { id: 1, postId: req.params.postId, author: 'Alice', content: 'Super article !' },
    { id: 2, postId: req.params.postId, author: 'Bob', content: 'Merci pour le partage.' }
  ]);
});

// Widgets dashboard fictifs
app.get('/api/dashboard/widgets', (req, res) => {
  res.json([
    { id: 1, type: 'stat', value: 123 },
    { id: 2, type: 'chart', data: [1,2,3] }
  ]);
});

// Données géographiques simulées
app.get('/api/map-data', (req, res) => {
  res.json({
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [2.35, 48.85] }, properties: { name: 'Paris' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [4.83, 45.76] }, properties: { name: 'Lyon' } }
    ]
  });
});

// Panier (cart) fictif
let cart = [];
app.get('/api/cart', (req, res) => {
  res.json(cart);
});
app.post('/api/cart', (req, res) => {
  const item = req.body;
  cart.push(item);
  res.status(201).json(item);
});

// Endpoint protégé
app.get('/api/secret', (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ secret: 'Bravo, tu es authentifié !' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
