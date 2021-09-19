const Product = require('../models/productModel')

const productController = {
    getProducts: async(req, res) => {
        try {
            const products = Category.find()
            return res.json(products)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },

    createProduct: async(req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ message: 'No images upload' })

            const product = await Product.findOne({ product_id })

            if (product) return res.status(400).json({ message: 'This product already exists' })
            const newProduct = new Product({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            })
            await newProduct.save()
            res.json({ message: 'Create a product' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    updateProduct: async(req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ message: 'No images upload' })

            await Product.findByIdAndUpdate(req.params.id, {
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            })

            return res.json({ message: 'Updated a product' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id)

            return res.json({ message: 'Deleted a product' })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
}

module.exports = productController