import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductsAPI() {
    const [producs, setProducts] = useState([])

    const getProducts = async () => {
        const res = await axios.get('/api/products')
        setProducts(res.data.products)
    }

    useEffect(() => {
        getProducts()
    }, [])

    return {
        products: [producs, setProducts]
    }
}

export default ProductsAPI
