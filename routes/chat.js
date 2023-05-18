const express=require('express');

const chatcontroller=require('../controllers/chat');
const auntheticateController=require('../middleware/auth');

const router=express.Router();

router.post('/chat',auntheticateController.authenticate,chatcontroller.postChat);
router.get('/chat',chatcontroller.getchat);

module.exports=router;