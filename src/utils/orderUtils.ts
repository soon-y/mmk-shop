import axios from 'axios'
import type { CategoryProps, OrderedProductProps, OrderProps, ProductProps, SortedOrderProductProps, SortedOrderProps } from '../types'
import { fetchProduct, grouppingImgs } from './productUtils'
import { fetchCategory } from './categoryUtils'

export function deliveryDate(dateString: string): string {
  const date = new Date(dateString)
  date.setDate(date.getDate() + 4)

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }

  return date.toLocaleDateString('en-GB', options).replace(/\//g, '.')
}

export function stringToDate(dateString: string): string {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }

  return date.toLocaleDateString('en-GB', options).replace(/\//g, '.')
}

export const sortedOrders = async (orders: OrderProps[], orderedProducts: OrderedProductProps[]): Promise<SortedOrderProps[]> => {
  const array: SortedOrderProps[] = orders.map(order => ({
    ...order,
    products: [] as SortedOrderProductProps[]
  }))

  const categoryData = await fetchCategory()

  const promises = orderedProducts.map(async (p) => {
    const productData = await fetchProduct(p.productId)
    const product: ProductProps = productData.data

    const colorId = product.color.split('/').findIndex((item) => item === p.color)
    const img = grouppingImgs(product.images, product.imagesCount)[colorId][0]

    const categoryId = categoryData.findIndex((item: CategoryProps) => item.id === product.category)
    const categoryGroupId = categoryData.findIndex((item: CategoryProps) => item.id === categoryData[categoryId].groupID)

    const newArr: SortedOrderProductProps = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: p.color,
      colorIndex: colorId,
      size: p.size,
      image: img,
      category: categoryData[categoryId].name,
      categoryGroup: categoryData[categoryGroupId].name,
      qnt: p.quantity,
      total: p.total,
    }

    const orderIndex = array.findIndex((o) => o.orderId === p.orderId)
    if (orderIndex !== -1) {
      array[orderIndex].products.push(newArr)
    }
  })

  await Promise.all(promises)

  return array
}

export const fetchOrders = async (user: string): Promise<OrderProps[] | null> => {
  try {
    const orders = await axios.get(`https://mmk-backend.onrender.com/orders/all`, {
      params: { user }
    })

    if (orders.status === 200 || orders.status === 201) {
      return orders.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const fetchThisOrder = async (user: string, orderId: string): Promise<OrderProps[] | null> => {
  try {
    const orders = await axios.get(`https://mmk-backend.onrender.com/orders/this`, {
      params: { user, orderId }
    })

    if (orders.status === 200 || orders.status === 201) {
      return orders.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const fetchOrderedProducts = async (user: string): Promise<OrderedProductProps[] | null> => {
  try {
    const products = await axios.get(`https://mmk-backend.onrender.com/orders/product`, {
      params: { user }
    })

    if (products.status === 200 || products.status === 201) {
      return products.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}