const passport = require('passport');
const bcrypt = require('bcrypt');

const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');

const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son requeridos'
});

//funciona para saber si el user eesta logueado
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado , sigue
    if (req.isAuthenticated()) {
        return next();
    }
    //sino, redirigir al form
    return res.redirect('/iniciar-sesion');

}
/**
 * cerrando la sesion
 */
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

//genera token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que exista
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });
    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        /* res.render('reestablecer',{
            nombrePagina:'Reestablecer password',
            mensajes: req.flash()
        }) */
        res.redirect('/reestablecer');
    }
    //usuario existe 
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardarlos en db
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //console.log(resetUrl);
    //console.log('Antes del get: ', req.params.token);

    //Enviar el correo 
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    /**
     * para probar sin emailfuncional  
     * */
    //res.redirect(`/reestablecer/${usuario.token}`)
    req.flash('correcto','Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}


exports.validarToken = async (req, res) => {
    //res.json(req.params.token);
    //console.log(req.params.token);
    const usuario = await Usuarios.findOne({
        where: { token: req.params.token }
    });

    //sino  se encuentra
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer')
    }
    //formulario para genearar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

exports.resetPassword = async (req, res) => {
    //verifica token valido y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }
    // hashear nuevo 
    
    
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos cambios
    await usuario.save();

    req.flash('correcto','Tu password se modifico correctamente');
    res.redirect('/iniciar-sesion');
}