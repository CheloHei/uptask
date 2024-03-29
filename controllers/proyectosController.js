const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas');
const slug = require('slug');
const qr = require('qr-image');

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id;


    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({ where: { usuarioId } });



    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}


exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    //enviar a consola lo que el usuario escriba
    //console.log(req.body);
    //validar que no venga vacio
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //no hay errores
        //insertar en la bd
        //const url = slug(nombre).toLowerCase();
        // const proyecto = await Proyectos.create({ nombre });
        const usuarioId = res.locals.usuario.id;

        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');

    }


}
exports.proyectoPorUrl = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    /* const code = qr.image('texto', { type: 'png' });
    const codes = code.pipe(res); */

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    if (!proyecto) return next();

    //consultar tareas de proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            { model: Proyectos }
        ]
    })

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
        //codes
    })
}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
    

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,usuarioId
        }
    });



    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto

    });
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
    //enviar a consola lo que el usuario escriba
    //console.log(req.body);
    //validar que no venga vacio
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto' })
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //no hay errores
        //insertar en la bd
        //const url = slug(nombre).toLowerCase();

        await Proyectos.update({ nombre: nombre },
            {
                where: { id: req.params.id }
            }
        );
        res.redirect('/');

    }

}
exports.eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    })

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}

//================PRUEBA EXITOSA DE IMAGEN QR================
/* exports.imagen = (req, res) => {
    const url = 'dfsf';
        const code = qr.image(url, { type: 'png' });
        res.type('png')
        code.pipe(res);
} */