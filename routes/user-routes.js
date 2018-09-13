const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user-controller');
const uniqueValidator = require('../middleware/unique-validator');
const users = require('../models/user-model');

router.post('/create', uniqueValidator(users,'email'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/@self', checkAuth, userController.getUser);
router.post('/cart-info', checkAuth, userController.getCartInfo);
module.exports = router;