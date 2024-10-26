const mongoose = require('mongoose')

const notaSchema = new mongoose.Schema({
    tit_not: {type: String, required: true},
    des_not: {type: String, required: true}
})

notaSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Nota', notaSchema) // mongoose.model('Nota', notaSchema) -> Crea un modelo de datos en la base de datos. El primer argumento es el nombre del modelo y el segundo es el schema. 
