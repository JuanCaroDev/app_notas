const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    ali_usu: {type: String, required: true, unique: true},
    ema_usu: {type: String, required: true, unique: true},
    cla_usu: {type: String, required: true}
})

// Antes de guardar el usuario, se hashea la contraseña
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('cla_usu')) return next();
    this.cla_usu = await bcrypt.hash(this.cla_usu, 10);
    next();
})
// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.cla_usu);
}

module.exports = mongoose.model('Usuario', usuarioSchema);