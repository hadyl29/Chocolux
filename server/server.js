const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chocolux',
});

db.connect();

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.status(200).send('Connexion réussie');
    } else {
      res.status(400).send('Échec de la connexion');
    }
  });
});
app.post('/signup', (req, res) => {
    const { nom, prenom, email, password, genre, telephone, dateNaissance } = req.body;
  
    const query = 'INSERT INTO users (nom, prenom, email, password, genre, telephone, dateNaissance) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [nom, prenom, email, password, genre, telephone, dateNaissance], (error, results) => {
      if (error) {
        res.status(500).send('Erreur lors de l\'inscription');
      } else {
        res.status(200).send('Inscription réussie');
      }
    });
  });
  
///////////////////////////////// PRODUCTS ////////////////////////////////////////////
// get un produits
app.get('/produits', (req, res) => {

  const query = 'SELECT * FROM produits';
  db.query(query, (error, result) => {
    if (error) {
      res.status(500).send('Erreur lors de la récupération du produit');
    } else if (result.length > 0) {
      res.json(result); 
    } else {
      res.status(404).send('Produit non trouvé');
    }
  });
});
// Route pour récupérer un produit spécifique par ID
app.get('/produits/:id', (req, res) => {
  const { id } = req.params; // Récupération de l'ID dans l'URL

  const query = 'SELECT * FROM produits WHERE id = ?';
  
  db.query(query, [id], (error, result) => {
    if (error) {
      res.status(500).send('Erreur lors de la récupération du produit');
    } else if (result.length > 0) {
      res.json(result[0]); // Retourne le produit trouvé
    } else {
      res.status(404).send('Produit non trouvé');
    }
  });
});

// Ajouter un produit
app.post('/produits', (req, res) => {
  const { title, prix, description, gout, type, image } = req.body;

  const query = 'INSERT INTO produits (title, prix, description, gout, type, image) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, prix, description, gout, type, image], (error, results) => {
    if (error) {
      res.status(500).send('Erreur lors de l\'ajout du produit');
    } else {
      res.status(200).send('Produit ajouté avec succès');
    }
  });
});

// Supprimer un produit
app.delete('/produits/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM produits WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send('Erreur lors de la suppression du produit');
    } else {
      res.status(200).send('Produit supprimé avec succès');
    }
  });
});

// Modifier un produit
app.put('/produits/:id', (req, res) => {
  const { id } = req.params;
  const { title, prix, description, gout, type, image } = req.body;

  const query = 'UPDATE produits SET title = ?, prix = ?, description = ?, gout = ?, type = ?, image = ? WHERE id = ?';
  db.query(query, [title, prix, description, gout, type, image, id], (error, results) => {
    if (error) {
      res.status(500).send('Erreur lors de la modification du produit');
    } else {
      res.status(200).send('Produit modifié avec succès');
    }
  });
});
app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});