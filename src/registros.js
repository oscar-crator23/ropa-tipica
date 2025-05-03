require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const session = require('express-session');
const path = require('path');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/armario_chiapas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Modelo de Usuario
const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usuario: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    codigo_postal: { type: String, required: true },
    telefono: { type: String, required: true },
    genero: { type: String, enum: ['femenino', 'masculino', 'otro', ''], default: '' },
    fecha_registro: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secreto_armario_chiapas',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 día
        secure: false // Cambiar a true en producción con HTTPS
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.post('/register', async (req, res) => {
    try {
        const { nombre, email, usuario, contraseña, confirmar } = req.body;
        
        // Validaciones
        if (contraseña !== confirmar) {
            return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Crear usuario
        const newUser = new User({
            nombre,
            email,
            usuario,
            contraseña: hashedPassword,
            direccion: req.body.direccion,
            ciudad: req.body.ciudad,
            estado: req.body.estado,
            codigo_postal: req.body.codigo_postal,
            telefono: req.body.telefono,
            genero: req.body.genero || ''
        });

        await newUser.save();

        // Enviar email de confirmación
        const mailOptions = {
            from: `"Armario de Chiapas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¡Registro Exitoso!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <img src="https://i.postimg.cc/7L25NYPW/Chat-GPT-Image-27-abr-2025-21-57-39.png" alt="Logo" style="width: 150px; display: block; margin: 0 auto 20px;">
                    <h2 style="color: #8B0000; text-align: center;">¡Bienvenid@ a Armario de Chiapas!</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Tu registro se ha completado exitosamente con los siguientes datos:</p>
                    <ul>
                        <li><strong>Usuario:</strong> ${usuario}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Fecha de registro:</strong> ${new Date().toLocaleDateString()}</li>
                    </ul>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:3000" style="background-color: #8B0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ir a la Tienda</a>
                    </p>
                    <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                        Si no realizaste este registro, por favor ignora este mensaje.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true,
            message: 'Registro exitoso. Revisa tu email para confirmación.'
        });

    } catch (error) {
        console.error('Error en registro:', error);
        let message = 'Error en el servidor';
        if (error.code === 11000) {
            message = error.message.includes('email') ? 'El email ya está registrado' : 'El nombre de usuario ya existe';
        }
        res.status(500).json({ success: false, message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario por email o nombre de usuario
        const user = await User.findOne({ 
            $or: [{ email: username }, { usuario: username }] 
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        // Crear sesión
        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            usuario: user.usuario
        };

        res.json({ 
            success: true,
            user: {
                nombre: user.nombre,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

app.get('/check-auth', (req, res) => {
    res.json({ 
        isAuthenticated: !!req.session.user,
        user: req.session.user || null
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Servir archivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});