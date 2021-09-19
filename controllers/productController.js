const Product = require('../models/productModel')

//filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filtering() {
        const queryObj = {
            ...this.queryString
        }
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        this.query.find(JSON.parse(queryStr))
        return this
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}

const productController = {
    getProducts: async(req, res) => {
        try {
            const feature = new APIfeatures(Product.find(), req.query).filtering().sorting().paginating()
            const products = await feature.query
            return res.json({
                status: 'success',
                result: products.length,
                products: products
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },

    createProduct: async(req, res) => {
        try {
            const {
                product_id,
                title,
                price,
                description,
                content,
                images,
                category
            } = req.body
            if (!images) return res.status(400).json({
                message: 'No images upload'
            })

            const product = await Product.findOne({
                product_id
            })

            if (product) return res.status(400).json({
                message: 'This product already exists'
            })
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
            res.json({
                message: 'Create a product'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    updateProduct: async(req, res) => {
        try {
            const {
                title,
                price,
                description,
                content,
                images,
                category
            } = req.body
            if (!images) return res.status(400).json({
                message: 'No images upload'
            })

            await Product.findByIdAndUpdate(req.params.id, {
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            })

            return res.json({
                message: 'Updated a product'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id)

            return res.json({
                message: 'Deleted a product'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
}

module.exports = productController