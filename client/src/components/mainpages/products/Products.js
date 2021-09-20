import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'


export default function Products() {
    const state = useContext(GlobalState)
    const [products] = state.ProductsAPI.products
    console.log(products)
    return (
        <div>
            Product
        </div>
    )
}
