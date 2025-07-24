import axios from 'axios'
import { getCookie } from './cookiesUtils'
import type { ProductProps, ProductSortedProps, UserSelectionProps } from '../types'

export const fetchProducts = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/products')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

export const fetchProduct = async (id: number) => {
  const res = axios.get(`https://mmk-backend.onrender.com/products/${id}`)
  return res
}

export const fetchProductAndSortData = async (id: number): Promise<ProductSortedProps | null> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/products/${id}`)
    const result = sortProductData(res.data)
    return result
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return null
  }
}

export const sortProductData = (data: ProductProps) => {
  const result: ProductSortedProps = {
    ...data,
    category: data.category,
    price: Number(data.price.toFixed(2)),
    color: data.color.split('/'),
    colorHex: data.colorHex.split('/'),
    size: data.size.split('/'),
    images: grouppingImgs(data.images, data.imagesCount),
    imagesCount: imgCount(data.imagesCount),
    stock: grouppingStock(data.stock),
  }

  return result
}

export const imgCount = (imagesCount: string): number[] => {
  const imgCnt = imagesCount.split('/').map(Number)
  const cumulativeSum: number[] = imgCnt.map((_, i, arr) =>
    arr.slice(0, i + 1).reduce((sum, num) => sum + num, 0)
  )
  cumulativeSum.unshift(0)
  return cumulativeSum
}

export const grouppingImgs = (images: string[], imagesCount: string) => {
  const imgCnt = imagesCount.split('/').map(Number)

  const groupedImages: string[][] = []
  let start = 0

  for (const count of imgCnt) {
    groupedImages.push(images.slice(start, start + count))
    start += count
  }

  return groupedImages
}

export const grouppingStock = (stock: string) => {
  const result = stock.split('/').map(group => group.split(',').map(Number))
  return result
}

export const getCookiesProducts = async (name: string): Promise<{
  cookiesItem: UserSelectionProps[],
  filtered: ProductSortedProps[],
}> => {
  const res = await fetchProducts()
  const cookie = getCookie(name)
  const cookiesItem: UserSelectionProps[] = cookie ? JSON.parse(cookie) : []

  const filtered: ProductSortedProps[] = []

  cookiesItem.forEach((item) => {
    const product: ProductProps = res.find((el: ProductProps) => el.id === item.id)
    if (product) {
      filtered.push(sortProductData(product))
    }
  })

  return { cookiesItem, filtered }
}

export const getUserProducts = async (name: string, user: string): Promise<{
  userItem: UserSelectionProps[],
  filtered: ProductSortedProps[],
}> => {

  const result = await axios.get(`https://mmk-backend.onrender.com/${name}`, {
    params: { user },
  })

  const userItem: UserSelectionProps[] = []

  const res = await fetchProducts()
  const filtered: ProductSortedProps[] = []

  result.data.forEach((item: {
    id: number,
    size: number,
    color: number,
    qnt?: number,
  }) => {
    const product: ProductProps = res.find((el: ProductProps) => el.id === item.id)

    if (product) {
      userItem.push({ id: item.id, size: item.size, color: item.color, qnt: item.qnt })
      filtered.push(sortProductData(product))
    }
  })

  return { userItem, filtered }
}