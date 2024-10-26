// Middleware de verificación de token

// Cargar las variable de entorno 
require('dotenv').config();
// Importar el modulo jsonwebtoken para la verificacion del token
const jwt = require('jsonwebtoken');
// Nos aseguramos que la clave secreta esté disponile para la verificación del token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

// req: el objeto de la solicitud HTTP.
// res: el objeto de respuesta HTTP.
// next: una función que se llama para pasar al siguiente middleware o controlador si el token es válido.

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso denegado, token faltante' });

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.usuario = usuario;
        next();
    });
};

module.exports = verificarToken;