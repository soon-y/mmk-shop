import type { UserSelectionProps } from "../types"

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)} expires=${expires}; path=/`
}

export function getCookie(name: string) {
  return document.cookie.split(' ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

export const exist = (favorites: UserSelectionProps[], product: UserSelectionProps) => {
  const existing = favorites.findIndex(item => item.id === product.id && item.size === product.size && item.color === product.color)
  if (existing === -1) {
    return -1
  } else {
    return existing
  }
}

export function saveCookie(name: string, product: UserSelectionProps) {
  const cookieRaw = getCookie(name)
  let cookie: UserSelectionProps[] = []

  if (cookieRaw) {
    try {
      cookie = JSON.parse(cookieRaw)
    } catch {
      cookie = []
    }
  }

  const existingIndex = exist(cookie, product)
  console.log(existingIndex)

  if (existingIndex === -1) {
    cookie.unshift(product)
  } else {
    if (name === 'cart') product.qnt = cookie[existingIndex].qnt! + 1
    cookie.splice(existingIndex, 1)
    cookie.unshift(product)
  }

  setCookie(name, JSON.stringify(cookie))
}

export function removeCookie(name: string, product: UserSelectionProps) {
  const cookieRaw = getCookie(name)
  if (!cookieRaw) return

  let cookie: UserSelectionProps[] = []
  try {
    cookie = JSON.parse(cookieRaw)
  } catch {
    cookie = []
  }

  cookie = cookie.filter(item => !(item.id === product.id && item.color === product.color))
  setCookie(name, JSON.stringify(cookie))
}

export function saveHistory(product: UserSelectionProps) {
  const historyRaw = getCookie('history')
  let history: UserSelectionProps[] = []

  if (historyRaw) {
    try {
      history = JSON.parse(historyRaw)
    } catch {
      history = []
    }
  }

  const existingIndex = exist(history, product)

  if (existingIndex === -1) {
    history.unshift(product)
  } else {
    history.splice(existingIndex, 1)
    history.unshift(product)
  }


  if (history.length > 12) {
    history = history.slice(0, 12)
  }

  setCookie('history', JSON.stringify(history))
}

export function updateCookieQnt(name: string, index: number, newVal: number) {
  const cookieRaw = getCookie(name)
  let cookie: UserSelectionProps[] = []

  if (cookieRaw) {
    try {
      cookie = JSON.parse(cookieRaw)
    } catch {
      cookie = []
    }
  }

  if (cookie[index]) {
    cookie[index].qnt = newVal
  }
  setCookie('cart', JSON.stringify(cookie))
}

export function getQntFromCartCookie(product: UserSelectionProps) {
  const cartRaw = getCookie('cart')
  let cart: UserSelectionProps[] = []

  if (cartRaw) {
    try {
      cart = JSON.parse(cartRaw)
    } catch {
      cart = []
    }
  }

  const existingIndex = exist(cart, product)

  if (existingIndex === -1) {
    return 1
  } else {
    return cart[existingIndex].qnt
  }
}

export function getTotalQntFromCartCookie() {
  const cartRaw = getCookie('cart')
  const cart: UserSelectionProps[] = cartRaw ? JSON.parse(cartRaw) : []
  let total: number = 0

  cart.forEach((el)=>{
    total = total + el.qnt! 
  })

  return total
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}