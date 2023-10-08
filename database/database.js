const Sequelize = require("sequelize");

const connection = new Sequelize('teste',
'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});



module.exports = connection;