const express = require('express')
const router = express.Router()
const notaController = require('../controllers/notaController')

router.get('/', notaController.getAllNotas)
router.get('/:id', notaController.getNotaById)
router.post('/', notaController.createNota)
router.put('/:id', notaController.updateNota)
router.delete('/:id', notaController.deleteNota)

module.exports = router // Exportamos el router para que pueda ser utilizado en otros archivos

