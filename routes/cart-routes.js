const express = require('express');
const router = express.Router();

const {decodeToken, checkUser, checkPrevilieges} = require('../middleware/check-auth');
const cartController = require('../controllers/cart-controller');

/**
 * @apiVersion 1.0.0
 * 
 * @api {post} /api/cart/add Add a product to Cart
 * @apiName addItem2Cart
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} productId Product Id (Id generated while creating the product)
 * @apiParam {String} quantity Number of products to be added
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Item Added To Cart Successfully!!!",
 *    }  
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "You Cannot Add More Than 25 Products To Cart At Once",
 *      "errorCode": "CA-2",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "The Product is Either Inactive Or Running Out Of Stock",
 *      "errorCode": "CC-AI2C-2",
 *      "errorType": "ItemNotFoundError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "There are only X products left in stock and you cannot add more than that",
 *      "errorCode": "CC-AI2C-3",
 *      "errorType": "DataValidationError"
 *    }
 * * @apiErrorExample {json} Error Response-5
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Unable To Add The Item To Cart",
 *      "errorCode": "CC-AI2C-4",
 *      "errorType": "UnknownError"
 *    }
 */
router.post('/add', decodeToken,
                    checkUser,
                    cartController.checkInventoryAvailability,
                    cartController.checkIsProductActiveInCart,
                    cartController.addItem2Cart);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/cart/info Get Saved Cart
 * @apiName getSavedCart
 * @apiGroup Cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully retrieved the cart data!!!",
 *      "data": [
 *          {
 *              "item": "Motorola Moto X4",
 *              "quantity": 12,
 *              "activeStatus": "active",
 *              "sku": 104,
 *              "id": "RuU2xqFVI"
 *          },
 *          {
 *              "item": "Adidas walking shoes",
 *              "quantity": 4,
 *              "activeStatus": "active",
 *              "sku": 105,
 *              "id": "eulweKj-7"
 *          }
 *      ]
 *   }
 *  * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CC-GAC-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/info', decodeToken, checkUser, cartController.getActiveCart);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/cart/history Get Cart History
 * @apiName getCartHistory
 * @apiGroup Cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully retrieved the cart data!!!",
 *      "data": [
 *          {
 *              "item": "Motorola Moto X4",
 *              "quantity": 12,
 *              "activeStatus": "inactive",
 *              "sku": 104,
 *              "id": "RuU2xqFVI"
 *          },
 *          {
 *              "item": "Adidas walking shoes",
 *              "quantity": 4,
 *              "activeStatus": "inactive",
 *              "sku": 105,
 *              "id": "eulweKj-7"
 *          }
 *      ]
 *    }
 *  * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CC-GCH-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/history', decodeToken, checkUser, cartController.getCartHistory);


/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/cart/update Update a cart item
 * @apiName updateCartItem
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} productId Product Id (Id generated while creating the product)
 * @apiParam {String} quantity Number of products to be added to cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Item Successfully Updated!!!",
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 *  * * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Request",
 *      "errorCode": "CC-UCI-1",
 *      "errorType": "DataValidationError"
 *    }
 * * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "You cannot add more than 25 products to cart at once.",
 *      "errorCode": "CC-UCI-1",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "There are only X products left in stock and you cannot add more than that",
 *      "errorCode": "CC-UCI-2",
 *      "errorType": "DataValidationError"
 *    }
 * * @apiErrorExample {json} Error Response-5
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Unable to update the item",
 *      "errorCode": "CC-UCI-3",
 *      "errorType": "ItemNotFoundError"
 *    }
 * @apiErrorExample {json} Error Response-6
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CC-UCI-4",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/update', decodeToken,
                    checkUser,
                    cartController.checkInventoryAvailability,
                    cartController.updateCartItem);

/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/cart/delete Delete an item from cart
 * @apiName deleteItemFromCart
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} productId Product Id (Id generated while creating the product)
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Deleted!!!",
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Request",
 *      "errorCode": "CC-DCI-1",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Unable to delete the Item",
 *      "errorCode": "CC-DCI-2",
 *      "errorType": "ItemNotFoundError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CC-DCI-3",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/delete', decodeToken, checkUser, cartController.deleteCartItem);

module.exports = router;