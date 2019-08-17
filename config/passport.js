const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propios (usuarios y password)
passport.use(
    new LocalStrategy(
        //por default passport espera usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email,password,done)=>{
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    
                    }
                });
                console.log(usuario);
                //el usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null,false,{
                        message: 'Password Incorrecto'
                    });    
                    console.log('password incorrecto');
                }
                //en caso contrario
                return done(null,usuario);
            } catch (error) {
                //ese user no existe 
                return done(null,false,{
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
);

//serializar usuario

passport.serializeUser((usuario,callback)=>{
    callback(null,usuario);
})

//deserializar usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario);
})

module.exports = passport;