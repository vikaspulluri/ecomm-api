const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const cartController = require('../controllers/cart-controller');
const validateIdParam = require('../middleware/validate-id-param');

router.post('/add', checkAuth, cartController.checkInventoryAvailability, cartController.addItem2Cart);
router.get('/info', checkAuth, cartController.getActiveCart);
router.get('/history', checkAuth, cartController.getCartHistory);
router.put('/update', checkAuth, cartController.checkInventoryAvailability, cartController.updateCartItem);
router.delete('/delete', checkAuth, cartController.deleteCartItem);
module.exports = router;