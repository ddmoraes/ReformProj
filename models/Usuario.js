const Sequelize = require("sequelize");
const connection = require("../database/database");

const Usuario = connection
    .define('usuario', {
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email : {
            type: Sequelize.STRING,
            allowNull: true
        },
        matricula: {
            type: Sequelize.STRING,
            allowNull: false
        },
        senha: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
Usuario.sync({ force: false });
module.exports = Usuario;