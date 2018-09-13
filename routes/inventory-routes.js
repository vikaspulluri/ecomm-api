const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const inventoryController = require('../controllers/inventory-controller');


router.get('/all', inventoryController.getAllInventory);
router.post('/add', checkAuth, 
                    inventoryController.checkProductExistenceInStock('add'),
                    inventoryController.addItemToInventory);
router.put('/edit/:id', checkAuth, inventoryController.updateInventoryById);
router.delete('/delete/:id', checkAuth, inventoryController.deleteInventoryById);



module.exports = router;