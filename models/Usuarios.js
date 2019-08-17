const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = require('../config/db');

const Proyectos = require('../models/Proyectos');

const Usuarios = db.define('usuarios',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg: 'Agrega un correo valido'
            },
            notEmpty:{
                msg: 'El e-mail no debe ir vacio'
            }
        },
        unique:{
            args:true,
            msg:'Usuario ya registrado'
        }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no debe ir vacio'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password,bcrypt.genSaltSync(10));
        }
    }
});
//metodo personalizado 
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

//muchos a muchos cardinalidad
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;