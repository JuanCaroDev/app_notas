const Nota = require('../models/nota')

// Obtener todas las notas
exports.getAllNotas = async (req, res) => {
    try {
        const notas = await Nota.find() // Devuelve un arreglo de objetos
        res.json(notas) // Devuelve un objeto JSON

    } catch (err) { // Catch se ejecuta si hay un error
        res.status(500).json({ message: err.message })
    }
}

// Obtener una nota por id
exports.getNotaById = async (req, res) => {
    try {
        const nota = await Nota.findById(req.params.id) //  req.params.id es el id que se envía en la URL
        if (nota === null) {
            return res.status(400).json({ message: 'Nota no encontrada' }) //  Si no encuentra la nota, devuelve un mensaje de error
        }
        res.json(nota)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
} 

exports.createNota = async (req, res) => {
    const nota = new Nota ({ // Instancia un nuevo objeto de la clase nota
        tit_not: req.body.tit_not,
        des_not: req.body.des_not,
    })

    try {
        const newNota = await nota.save()
        res.status(201).json(newNota)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateNota = async (req, res) => {
    try {
        const nota = await Nota.findById(req.params.id)
        if (nota === null) {
            return res.status(404).json({ message: 'Nota no encontrada'})
        }
        if (req.body.tit_not !== null) {
            nota.tit_not = req.body.tit_not
        }
        if (req.body.des_not !== null) {
            nota.des_not = req.body.des_not
        }

        const updateNota = await nota.save() // Guarda los cambios en la base de datos
        res.json(updateNota) // Devuelve la nota actualizada

    } catch (err) {
        res.status(404).json({ message: err.message})
    }
}

exports.deleteNota = async (req, res) => {
    try {
        const deletedNota = await Nota.findByIdAndDelete(req.params.id)

        if (!deletedNota) {
            return res.status(404).json({ message: 'Nota no encontrada' })
        }
        res.status(200).json ({ message: 'Nota eliminada' })
    } catch (err) {
        console.error('Error al eliminar la nota: ', err.message)
        res.status(500).json({ message: 'Error al eliminar la nota' })
    }
}