const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const user = require('./user');

const UserGroup = sequelize.define('usergroup', {
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
      },
      name:{
        type:Sequelize.STRING,
        allowNull:false
      },

  // userId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: 'user',
  //     key: 'id'
  //   }
  // },
  admin:Sequelize.BOOLEAN
});

module.exports = UserGroup;