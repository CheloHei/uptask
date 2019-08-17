const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
exports.crearCuentaView = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciar-sesion', {
        nombrePagina: 'Inicio de Sesion en Uptask',
        error
    })
}
exports.crearCuenta = async (req, res) => {
    //leer los  datos
    const { email, password } = req.body;

    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        //crear url para confirmar
        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar cuenta',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo para que confirmes tu cuenta');

        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        })
    }



}

exports.formReestablecer = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: { email: req.params.correo }
    });
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Cuenta activada con exito');
    res.redirect('/iniciar-sesion');
}