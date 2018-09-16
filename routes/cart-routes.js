const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const cartController = require('../controllers/cart-controller');

router.post('/add', checkAuth,
                    cartController.checkInventoryAvailability,
                    cartController.checkIsProductActiveInCart,
                    cartController.addItem2Cart);
router.get('/info', checkAuth, cartController.getActiveCart);
router.get('/history', checkAuth, cartController.getCartHistory);
router.put('/update', checkAuth,
                        cartController.checkInventoryAvailability,
                        cartController.updateCartItem,);
router.put('/delete', checkAuth, cartController.deleteCartItem);

module.exports = router;