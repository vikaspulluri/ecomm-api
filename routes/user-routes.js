const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/info', userController.getUser);
router.post('/cart-info', userController.getCartInfo);
module.exports = router;