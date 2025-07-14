import axios, { type AxiosResponse } from 'axios'

export const fetchCustomer = async (): Promise<AxiosResponse | false> => {
  const token = localStorage.getItem('MMKtoken')
  if (!token) return false

  try {
    const res = await axios.get('https://mmk-backend.onrender.com/users/customer', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return false
  }
}

export const register = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const res = await axios.post('https://mmk-backend.onrender.com/auth/registerCustomer', { email, password, firstName, lastName })
    if (res.status === 201 || res.status === 200) {
      return true
    } else {
      console.error('Unexpected response from server.')
      return false
    }
  } catch (err) {
    console.error(err)
  }
}

export const findCustomerByEmail = async (email: string) => {
  try {
    const res = await axios.post('https://mmk-backend.onrender.com/auth/findCustomerByEmail', { email })
    if (res) return res.data
  } catch (err) {
    console.error(err)
  }
}

export const login = async (email: string, password: string): Promise<AxiosResponse | 'unauthorized' | null> => {
  try {
    const res = await axios.post('https://mmk-backend.onrender.com/auth/loginCustomer', { email, password })

    if (res.status === 200 || res.status === 201) {
      localStorage.setItem('MMKtoken', res.data.access_token)
      
      return res
    }

    return null
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return 'unauthorized'
      }
      console.error('Login failed:', err.message)
    } else {
      console.error('Unexpected error:', err)
    }
    return null
  }
}
