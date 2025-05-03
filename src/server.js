const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345', // tu contraseña si tienes
  database: 'armario_chiapas'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para manejar el registro
app.post('/register', (req, res) => {
  const { nombre, email, usuario, contraseña, confirmar } = req.body;

  if (contraseña !== confirmar) {
    return res.send('Las contraseñas no coinciden');
  }

  const query = 'INSERT INTO usuarios (nombre, email, usuario, contraseña) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, email, usuario, contraseña], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al registrar usuario');
    }
    // Redirigir a index.html si todo fue bien
    res.redirect('/index.html');
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
