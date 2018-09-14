const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const inventoryController = require('../controllers/inventory-controller');
const validateIdParam = require('../middleware/validate-id-param');

router.get('/all', inventoryController.getAllInventory);
router.get('/:id', validateIdParam, inventoryController.getInventoryById);
router.post('/add', checkAuth, 
                    inventoryController.checkProductExistenceInStock('add'),
                    inventoryController.addItemToInventory);
router.put('/edit/:id', checkAuth,
                        validateIdParam,
                        inventoryController.checkProductExistenceInStock('update'),
                        inventoryController.updateInventoryById);
router.delete('/delete/:id', checkAuth, validateIdParam, inventoryController.deleteInventoryById);



module.exports = router;