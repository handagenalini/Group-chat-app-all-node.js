const express = require('express');
const groupControllers = require('../controllers/group');
const authenticateControllers = require('../middleware/auth');

const router = express.Router();
router.post('/group/creategrp',authenticateControllers.authenticate,groupControllers.createGroup);

router.get('/users/getgroupname',authenticateControllers.authenticate,groupControllers.getgroupname);

module.exports = router;