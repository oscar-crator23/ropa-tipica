import express from 'express';
import path from 'path';
import { PORT } from './config.js';
import { pool } from './db.js';
import { insercionRoutes, clienteRoutes } from './routes/index.js';
import productosRoutes from './routes/productos.routes.js';
import registrosRoutes from './routes/registros.routes.js';
import userRoutes from './routes/user.routes.js';
import morgan from 'morgan';

const app = express();

app.use(express.json());

// Middleware
app.use(morgan('dev'));
app.use(express.static('src')); // Servir archivos estáticos

// Rutas de API
app.use('/api/insercion', insercionRoutes);
app.use('/api/cliente', clienteRoutes);

// Rutas de contenido
app.use('/productos', productosRoutes);
app.use('/user', userRoutes);
app.use('/registros', registrosRoutes);

// Ruta principal
app.get('/register', (req, res) => {
    res.sendFile(path.resolve('src/registros.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT);
});

