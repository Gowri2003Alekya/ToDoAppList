const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN)');
  }
});

app.use(express.json());

// Get all todos
app.get('/todos', (req, res) => {
  
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API');
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  if (!title || !completed) {
    return res.status(400).json({ message: 'Title and completed fields are required.' });
  }
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, title, completed });
  });
});

// Other CRUD operations (Update, Delete) can be added similarly

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
