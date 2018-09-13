const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const categoryController = require('../controllers/category-controller');

router.get('/all', checkAuth, categoryController.getCategories);
router.post('/create', checkAuth, categoryController.checkCategoryExistence('create'), categoryController.checkParentCategoryValidity(), categoryController.createCategory);
router.put('/edit/:slugname', checkAuth, categoryController.checkCategoryExistence('edit'), categoryController.checkParentCategoryValidity('edit'), categoryController.editCategory);
router.delete('/delete/:slugname', checkAuth, categoryController.deleteCategory);


module.exports = router;