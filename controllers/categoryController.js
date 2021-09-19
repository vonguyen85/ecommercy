const Category = require('../models/categoryModel')

const categoryController = {
    getCategories: async(req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    createCategory: async(req, res) => {
        try {
            const { name } = req.body
            const category = await Category.findOne({ name })

            if (category) return res.status(400).json({ message: 'This category already exist' })

            const newCategory = new Category({
                name: name
            })

            await newCategory.save()
            return res.json({ message: 'Create a category' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    updateCategory: async(req, res) => {
        try {
            await Category.findByIdAndUpdate(req.params.id, {
                name: req.body.name
            })
            return res.json({ message: 'Update a Category' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    deleteCategory: async(req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            return res.json({ message: 'Delete a Category' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = categoryController