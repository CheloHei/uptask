const Sequelize = require('sequelize');
const Db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');
// var qrcode = require('qrcode')


const db = Db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING,
    //imagen: Sequelize.STRING

}, {
        hooks: {
            beforeCreate(proyecto) {
                const url = slug(proyecto.nombre).toLowerCase();

                proyecto.url = `${url}-${shortid.generate()}`;

            
                //=========>>>>>>Prueba de img con qr<<<<<=======
                /*  QRCode.toDataURL(url,(err, img)=> {
                      imagen = img
                      
                      proyecto.qr = imagen;
                  }) */
            }
        }
    });

module.exports = db;