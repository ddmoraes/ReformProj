const Sequelize = require("sequelize");
const connection = require("../database/database");
const Empresa = require("./empresa"); 

const Usuario = connection.define('usuario', {
    matricula: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true
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


function generateRandomMatricula() {
    const min = 1000; 
    const max = 9999; 
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(random);
}


Usuario.beforeCreate(async (usuario, options) => {
    usuario.matricula = generateRandomMatricula();
});

Usuario.sync({ force: false });
module.exports = Usuario;