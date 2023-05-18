const Chat = require('../models/chat');
const { Op } = require('sequelize');

exports.postChat = async(req, res, next)=>{
  try{
    console.log(req);
    await Chat.create({
        message: req.body.text,
        userId:req.user.id,
        userName:req.user.name,
        groupId: req.query.groupid,
        time: new Date().getTime()//
    })

    res.status(201).json({message:'Successfully sent text'});
  } 
  catch(err){
    console.log(err);
    res.status(500).json({message: err, success:false})
  }
}
exports.getchat = async (req, res, next) => {
  try {
    // const currentTime = req.query.currenttime;
    // console.log(currentTime)
    const gropuId = req.query.groupid || null ; // set groupid to null if not provided in query params
console.log(gropuId,'------------------------------')
    const messages = await Chat.findAll({
      where:{groupId:gropuId}
    
      
      
    });
    res.status(201).json({ success: true, message: messages });
  }
  catch (err) {
      res.status(500).json({ message: err, success: false })
  }
}