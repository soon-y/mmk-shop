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

export function saveFavorite(product: string) {
  const favoritesRaw = getCookie('favorites')
  let favorites: string[] = []

  if (favoritesRaw) {
    try {
      favorites = JSON.parse(favoritesRaw)
    } catch {
      favorites = []
    }
  }

  if (!favorites.includes(product)) {
    favorites.unshift(product)
  }

  setCookie('favorites', JSON.stringify(favorites))
}

export function removeFavorite(product: string) {
  const favoritesRaw = getCookie('favorites')
  if (!favoritesRaw) return

  let favorites: string[] = []
  try {
    favorites = JSON.parse(favoritesRaw)
  } catch {
    favorites = []
  }

  favorites = favorites.filter(item => item !== product)

  setCookie('favorites', JSON.stringify(favorites))
}

export function saveHistory(product: string) {
  const historyRaw = getCookie('history')
  let history: string[] = []

  if (historyRaw) {
    try {
      history = JSON.parse(historyRaw)
    } catch {
      history = []
    }
  }

  if (history.includes(product)) {
    history = history.filter(item => item !== product)
  }
  history.unshift(product)

  setCookie('history', JSON.stringify(history))
}

export function saveCart(product: string) {
  const cartRaw = getCookie('cart')
  let cart: string[] = []

  if (cartRaw) {
    try {
      cart = JSON.parse(cartRaw)
    } catch {
      cart = []
    }
  }

  if (!cart.includes(product)) {
    cart.push(product)
  }

  setCookie('cart', JSON.stringify(cart))
}

export function removeCart(product: string) {
  const cartRaw = getCookie('cart')
  if (!cartRaw) return

  let cart: string[] = []
  try {
    cart = JSON.parse(cartRaw)
  } catch {
    cart = []
  }

  cart = cart.filter(item => item !== product)

  setCookie('cart', JSON.stringify(cart))
}
