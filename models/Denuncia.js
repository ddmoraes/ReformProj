
const Sequelize = require("sequelize");
const connection = require("../database/database");
const Empresa = require("./empresa"); 


const Denuncia = connection.define('denuncia', {
    texto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    video: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    empresaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Empresa, 
            key: 'id', 
        },
    },
});
const Usuario = require("./Usuario"); 

Denuncia.belongsTo(Usuario, {
    foreignKey: 'matriculaUsuario',
    as: 'usuario', 
});
Denuncia.sync({ force: false });
module.exports = Denuncia;
