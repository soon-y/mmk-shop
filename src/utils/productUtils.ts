import axios from 'axios'
import { getCookie } from './cookieUtils'
import type { ProductProps } from '../types'

export const fetchProducts = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/products')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

export const groupingImages = (existingImagesCount: string[], images: string[]) => {
  const groupedImages: string[][] = []
  let start = 0

  for (const count of existingImagesCount) {
    groupedImages.push(images.slice(start, start + Number(count)))
    start += Number(count)
  }

  return groupedImages
}

export const fetchProduct = async (id: number) => {
  const res = axios.get(`https://mmk-backend.onrender.com/products/${id}`)
  return res
}

export const imgCount = (imagesCount: string): number[] => {
  const imgCnt = imagesCount.split('/').map(Number)
  const cumulativeSum = imgCnt.map((_, i, arr) =>
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

export const getCookieProducts = async (name: string): Promise<{
  cookieName: string[],
  filtered: ProductProps[],
  imgCountArr: number[][],
  stock: number[],
}> => {
  const res = await fetchProducts()
  const cookie = getCookie(name)
  const cookieName: string[] = cookie ? JSON.parse(cookie) : []

  const filtered: ProductProps[] = []
  const imgCountArr: number[][] = []
  const stock: number[] = []

  cookieName.forEach(item => {
    const itemArr = item.split('/').map(el => Number(el))
    const product: ProductProps = res.find((el: ProductProps) => el.id === itemArr[0])
    if (product) {
      filtered.push(product)
      imgCountArr.push(imgCount(product.imagesCount))
      const stockArr: number[][] = grouppingStock(product.stock);
      const row = stockArr[itemArr[1]]
      if (row && typeof row[itemArr[2]] !== 'undefined') {
        stock.push(row[itemArr[2]])
      }
    }
  })

  return { cookieName, filtered, stock, imgCountArr }
}