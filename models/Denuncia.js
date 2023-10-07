const Sequelize = require("sequelize");
const connection = require("../database/database");

const Denuncia = connection.define('denuncia', {
    texto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: false
    },
    video: {
        type: Sequelize.STRING,
        allowNull: false
    },
   
});

Denuncia.sync({ force: false });

module.exports = Denuncia;
