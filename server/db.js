const {Sequelize} = require('sequelize');
const dotenv= require('dotenv');
dotenv.config();
// console.log(process.env.DB_PASSWORD,);

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:'postgres',
        host:    process.env.DB_HOST,
        port:    process.env.DB_PORT
    } 
) 