import axios, { type AxiosResponse } from 'axios'
import type { OrderedProductProps, OrderProps, UserSelectionProps } from '../types'

export const fetchUserSelection = async (name: string, user: string): Promise<UserSelectionProps[] | false> => {
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

export const dropUserCart = async (user: string): Promise<AxiosResponse | false> => {
  try {
    const res = axios.post(`https://mmk-backend.onrender.com/cart/drop`, {
      user
    })
    return res
  } catch (err) {
    return false
  }
}

export const addOrder = async (orderInfo: OrderProps, productInfo: OrderedProductProps[]): Promise<AxiosResponse | false> => {
  try {
    const res = axios.post(`https://mmk-backend.onrender.com/orders/add`, {
      orderInfo, productInfo
    })
    return res
  } catch (err) {
    return false
  }
}

export const fetchOrder = async (user: string): Promise<OrderProps | null> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/orders`, {
      params: { user }
    })

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null;
    }
  } catch (err) {
    return null;
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

export const getTotalQntFromUserCart = async (user: string): Promise<number | false> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/cart`, {
      params: { user },
    })

    const total: number = res.data.reduce((sum: number, el: UserSelectionProps) => sum + (el.qnt ?? 0), 0)

    return total
  } catch (err) {
    return false
  }
}