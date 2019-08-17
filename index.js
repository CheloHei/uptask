const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const helpers = require('./helpers');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
//IMPORTAR VARIABLES GLOBALES
require('dotenv').config({path: 'variables.env'})



//Crear la conexion a la base de datos
const db = require('./config/db');
//importando modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


// db.authenticate().
// then(()=>{
//     console.log('Conectado al server');
// })
// .catch(error => console.log(error))


db.sync()
    .then(() => {
        console.log('Conectado al server');
    })
    .catch(error => console.log(error));



//crear una app
const app = express();

//cargar los archivos estaticos
app.use(express.static('public'));

//habilitar body parser para leer datos del form
app.use(bodyParser.urlencoded({ extended: true }));


//habilitar pug
app.set('view engine', 'pug');


//añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

//sesiones nos permiten navegar entre paginas sin volvernos a  loguear
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());

app.use(passport.session());

//pasar helpers
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});





app.use('/', routes());


//SERVIDOR Y PUERTO
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port,host,()=>{
    console.log('El servidor esta corriendo');
});

