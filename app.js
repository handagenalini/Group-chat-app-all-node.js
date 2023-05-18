const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const cors = require('cors');
require('dotenv').config();

const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/usergroup');
// import io from 'socket.io-client';


const app = express();
app.use(cors());

const io = require('socket.io')(8000,{
    cors: {
        origin: '*',
      }
});


io.on('connection', socket => {
    socket.on('send-message', room => {
        console.log(room);
        io.emit('receive-message', room);
    });
})

app.use(bodyParser.json({ extended: false }));
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group');
const groupChatRoute = require('./routes/groupchat');

app.use('/users',userRoute);
app.use('/users', chatRoute);
app.use(groupRoute);
app.use(groupChatRoute);


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, { through: 'usergroup', foreignKey: 'userId' });
Group.belongsToMany(User, { through: 'usergroup', foreignKey: 'groupId' });

// foreignKey - primarykey of one table with another table

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize

.sync({alter: true})
.then(result=>{
   app.listen(3000);
})
.catch(err=>{
    console.log(err);
}); 