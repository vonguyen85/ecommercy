const router = require('express').Router()
const categoryController = require('../controllers/categoryController')

const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/category')
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory)
router.route('/category/:id')
    .put(auth, authAdmin, categoryController.updateCategory)
    .delete(auth, authAdmin, categoryController.deleteCategory)

module.exports = router