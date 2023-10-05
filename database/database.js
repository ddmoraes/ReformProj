const Sequelize = require("sequelize");

const connection = new Sequelize('turma_tarde',
'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;