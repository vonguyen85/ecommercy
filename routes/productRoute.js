const router = require('express').Router()
const productController = require('../controllers/productController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/products')
    .get(productController.getProducts)
    .post(productController.createProduct)

router.route('/product/:id')
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router