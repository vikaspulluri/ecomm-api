const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product-controller');


router.get('/all', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/create', checkAuth, productController.getCategoryId, productController.createProduct);
router.put('/edit/:id', checkAuth, productController.checkProductExistence, productController.getCategoryId, productController.updateProduct);
router.delete('/delete/:id', checkAuth, productController.checkProductExistence, productController.deleteProduct);


module.exports = router;