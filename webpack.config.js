const path = require('path');

const webpack = require('webpack');

module.exports = {
    entry: './public/js/app.js', //carpeta donde se realiza la entra
    output:{ //salida del archivo 
        filename : 'bundle.js', //nombre de la salida
        path: path.join(__dirname,'./public/dist') //ruta donde se almacena el archivo
    },
    module:{
        rules:[ //definicion de reglas  de uso 
            {
                test: /\.m?js$/, //que busque todos los archivos js
                use:{ //le decimos que plugin quiere que utilicemos
                    loader: 'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    }
}