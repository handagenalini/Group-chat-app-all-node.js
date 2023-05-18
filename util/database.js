require('dotenv').config();

const Sequelize=require('sequelize');

const sequelize=new Sequelize('chat-app','root','handage@12',{
    dialect: 'mysql',
    host:'localhost'
});
module.exports=sequelize;