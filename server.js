const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'react',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM crud', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/api/data', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO crud (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    db.query('SELECT * FROM crud WHERE id = ?', [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error checking record existence:', selectErr);
        res.status(500).send('Internal Server Error');
      } else {
        if (selectResult.length === 0) {
          res.status(404).send('Record not found');
        } else {
          db.query('UPDATE crud SET name=?, description=? WHERE id=?', [name, description, id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating data:', updateErr);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Data updated successfully');
              res.send(updateResult);
            }
          });
        }
      }
    });
}); 
  
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM crud WHERE id = ?', [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error checking record existence:', selectErr);
        res.status(500).send('Internal Server Error');
      } else {
        if (selectResult.length === 0) {
          res.status(404).send('Record not found');
        } else {
          db.query('DELETE FROM crud WHERE id=?', [id], (err, result) => {
            if (err) {
              console.error('Error deleting data:', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Data deleted successfully');
              res.send(result);
            }
          });
        }
      }
    });
});    

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
