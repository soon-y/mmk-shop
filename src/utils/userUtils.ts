import axios, { type AxiosResponse } from 'axios'
import type { UserSelectionProps } from '../types'

export const fetchUserSelection = async (name: string, user: string): Promise<AxiosResponse<UserSelectionProps[]> | false> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/${name}`, {
      params: { user },
    })
    return res.data
  } catch (err) {
    return false
  }
}

export const addUserSelection = async (name: string, user: string, product: UserSelectionProps): Promise<AxiosResponse | false> => {
  try {
    const res = axios.post(`https://mmk-backend.onrender.com/${name}/add`, {
      user, product
    })
    return res
  } catch (err) {
    return false
  }
}

export const deleteUserSelection = async (name: string, user: string, product: UserSelectionProps): Promise<AxiosResponse | false> => {
  try {
    console.log(product)
    const res = axios.post(`https://mmk-backend.onrender.com/${name}/delete`, {
      user, product
    })
    return res
  } catch (err) {
    return false
  }
}

export const updateCartQnt = async (user: string, index: number, qnt: number): Promise<AxiosResponse | false> => {
  try {
    const res = axios.post(`https://mmk-backend.onrender.com/cart/update`, {
      user, index, qnt
    })
    return res
  } catch (err) {
    return false
  }
}

export const getQntFromUserCart = async (user: string, product: UserSelectionProps): Promise<AxiosResponse<number> | false> => {
  try {
    const res = axios.get(`https://mmk-backend.onrender.com/cart/getQnt`, {
      params: { user, id: product.id, size: product.size, color: product.color, },
    })
    return res
  } catch (err) {
    return false
  }
}