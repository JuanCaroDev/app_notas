const express = require('express')
// Generar y verificar los tokens JWT
const jwt = require('jsonwebtoken') 
const Usuario = require('../models/Usuario')
// Creamos un router para manejar las rutas
const router = express.Router()

// Clave secreta para generar el token
const JWT_SECRET = 'clave_secreta'

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { ali_usu, ema_usu, cla_usu } = req.body;

        // Verificar si el usuario o el correo ya existen
        const usuarioExistente = await Usuario.findOne({
            $or: [{ ali_usu }, { ema_usu }]
        });

        if (usuarioExistente) {
            return res.status(400).json({ message: 'El nombre de usuario o correo ya existe' });
        }

        // Crear y guardar un nuevo usuario
        const usuario = new Usuario({ ali_usu, ema_usu, cla_usu });
        await usuario.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
})

// Inicio de sesión
router.post('/login', async (req, res) => {
    try {
        const { ali_usu, ema_usu, cla_usu } = req.body;

        // Buscar el usuario por nombre de usuario o correo electrónico
        const usuario = await Usuario.findOne({
            $or: [{ ali_usu }, { ema_usu }]
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const esValido = await usuario.comparePassword(cla_usu);
        if (!esValido) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
})

module.exports = router