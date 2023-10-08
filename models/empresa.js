const Sequelize = require("sequelize");
const connection = require("../database/database");

const Empresa = connection.define('empresa', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Empresa.sync({ force: false });

module.exports = Empresa;