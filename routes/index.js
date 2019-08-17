const express = require('express');
//const qr = require('qr-image');

const router = express.Router();
const { body } = require('express-validator/check');

const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


module.exports = () => {

    //ruta para el home
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    //Vista que llama form para crear proyecto
    router.get('/nuevoProyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto);

    //Metodo para crear proyecto
    router.post('/nuevoProyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    //Metodo para actualizar proyecto
    router.post('/nuevoProyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);

    //listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl);


    //Vista de Actualizar project
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar);

    //eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto);

    //===============GENERAR CODIGO QR    
    /* router.get('/qrcode',(req,res)=>{
        const url = 'algo';
        const code = qr.image(url, { type: 'png' });
        res.type('png')
        code.pipe(res);
    }) */

    //router.get('/qrcode',proyectosController.imagen);

    //  router.get('/proyectoImagen',proyectosController.imagen);

    /**
     * ===============TAREAS===================
     */
    router.post('/proyectos/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea);

    //Actualizar tarea
    router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstado);

    //Eliminar tarea
    router.delete('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea);

    /*Crear cuenta usuario */
    //llamar vista de formulario
    router.get('/crear-cuenta', usuariosController.crearCuentaView);
    //procesar los datos 
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    /*
    ================iniciar sesion
    */
    //cargar vista
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    //procesar datos
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion',authController.cerrarSesion);

    /**
     * Reestablecer contraseña
     */
    //Llamar ruta desde usuarios para restablecer contraseña
    router.get('/reestablecer',usuariosController.formReestablecer);
    //Procesar datos desde form restablecer para generar token
    router.post('/reestablecer',authController.enviarToken);

    router.get('/reestablecer/:token',authController.validarToken);

    router.post('/reestablecer/:token',authController.resetPassword);

    return router;
}

