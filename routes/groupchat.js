const express = require('express');
const groupControllers = require('../controllers/groupchat');
const auntheticateController=require('../middleware/auth');

const router = express.Router();

router.get('/groupusers/getname',groupControllers.getGroupUser);
router.post('/group/removemember', auntheticateController.authenticate,groupControllers.removeuser);
router.post('/group/makememberadmin', auntheticateController.authenticate,groupControllers.makememberadmin);

module.exports = router;