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
  
  // Table pour la gestion des profils utilisateur
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    bio TEXT,
    avatar TEXT,
    birthDate TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
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

// --- API GESTION DE PROFIL ---

// GET all profiles
app.get('/api/profiles', (req, res) => {
  db.all('SELECT * FROM profiles ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET profile by id
app.get('/api/profiles/:id', (req, res) => {
  db.get('SELECT * FROM profiles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Profile not found' });
    res.json(row);
  });
});

// POST create profile
app.post('/api/profiles', (req, res) => {
  const { firstName, lastName, email, phone, address, bio, avatar, birthDate } = req.body;
  
  // Validation des champs obligatoires
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName and email are required' });
  }
  
  // Validation format email basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const stmt = db.prepare(`INSERT INTO profiles 
    (firstName, lastName, email, phone, address, bio, avatar, birthDate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    
  stmt.run([firstName, lastName, email, phone, address, bio, avatar, birthDate], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    // Récupérer le profil créé
    db.get('SELECT * FROM profiles WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
  stmt.finalize();
});

// PUT update profile
app.put('/api/profiles/:id', (req, res) => {
  const { firstName, lastName, email, phone, address, bio, avatar, birthDate } = req.body;
  const profileId = req.params.id;
  
  // Validation des champs obligatoires
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName and email are required' });
  }
  
  // Validation format email basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const stmt = db.prepare(`UPDATE profiles SET 
    firstName = ?, lastName = ?, email = ?, phone = ?, 
    address = ?, bio = ?, avatar = ?, birthDate = ?, 
    updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?`);
    
  stmt.run([firstName, lastName, email, phone, address, bio, avatar, birthDate, profileId], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Récupérer le profil mis à jour
    db.get('SELECT * FROM profiles WHERE id = ?', [profileId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
  stmt.finalize();
});

// PATCH partial update profile
app.patch('/api/profiles/:id', (req, res) => {
  const profileId = req.params.id;
  const updates = req.body;
  
  // Vérifier que le profil existe
  db.get('SELECT * FROM profiles WHERE id = ?', [profileId], (err, profile) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    // Construire la requête dynamiquement
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'bio', 'avatar', 'birthDate'];
    const fieldsToUpdate = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Validation email si présent
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }
    
    fieldsToUpdate.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(profileId);
    
    const query = `UPDATE profiles SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      // Récupérer le profil mis à jour
      db.get('SELECT * FROM profiles WHERE id = ?', [profileId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    });
  });
});

// DELETE profile
app.delete('/api/profiles/:id', (req, res) => {
  db.run('DELETE FROM profiles WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Profile not found' });
    res.status(204).send();
  });
});

// GET profiles by email (utile pour la recherche)
app.get('/api/profiles/search/:email', (req, res) => {
  const email = req.params.email;
  db.get('SELECT * FROM profiles WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Profile not found' });
    res.json(row);
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
