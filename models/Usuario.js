const Sequelize = require("sequelize");
const connection = require("../database/database");

const Usuario = connection.define('usuario', {
    matricula: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false, 
        unique: true,
        autoIncroment: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    nivel: { 
        type: Sequelize.STRING, 
        allowNull: false
    }
});

Usuario.sync({ force: false });

module.exports = Usuario;