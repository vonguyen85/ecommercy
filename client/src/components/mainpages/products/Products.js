import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/product_item/ProductItem'
import Loading from '../utils/loading/Loading'

export default function Products() {
    const state = useContext(GlobalState)
    const [products] = state.ProductsAPI.products

    return (
        <>
        <div className="products">
            {
                products.map(product => {
                    return <ProductItem key={product._id} product={product} />
                })
            }
        </div>
        {products.length === 0 && <Loading/>}
        </>
    )
}
