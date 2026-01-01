const { Sequelize } = require('sequelize');

// Configuração do Sequelize para utilizar SQLite
// O arquivo do banco sera gerado automaticamente na raiz do projeto

const sequelize = new Sequelize({
    
    dialect: 'sqlite',
    storage: './database.sqlite', // Nome do arquivo definido no seu .gitignore
    logging: false // Desativa logs de SQL no terminal para manter a visualização limpa

});

module.exports = sequelize;