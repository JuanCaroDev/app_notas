require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const notaRoutes = require('./routes/notas')
const authRoutes = require('./routes/auth')
const verificarToken = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(cors())

// Rutas de autenticación
app.use('/api/auth', authRoutes)

// Enmascaramos la ruta para protegerla
app.use('/api/notas', verificarToken, notaRoutes)

mongoose.connect('process.env.MONGODB_URI', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log('Conectado a MongoDB')
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`)
    })
}).catch(err => {
    console.error('Error al conectar a MongoDB', err)
})

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('¡Algo salió mal!')
})