export type ProductProps = {
  id: number
  name: string
  category: number
  price: number
  stock: string
  images: string[]
  description: string
  material: string
  size: string
  color: string
  colorHex: string
  imagesCount: string
  measurement: string
}

export type ProductResultProps = {
  id: number
  name: string
  categoryGroup: string
  category: string
  price: number
  stock: number[][]
  images: string[][]
  description: string
  material: string
  size: string[]
  color: string[]
  colorHex: string[]
  imagesCount: number[]
  measurement: string
}

export type ProductDisplayProps = {
  id: number
  name: string
  category: number
  price: number
  stock: string
  images: string[]
  size: string
  color: string
  colorHex: string
  created_at: string
}

export type ProductSortedProps = {
  id: number
  name: string
  category: number
  price: number
  stock: number[][]
  images: string[][]
  description: string
  material: string
  size: string[]
  color: string[]
  colorHex: string[]
  imagesCount: number[]
  measurement: string
}

export type CategoryProps = {
  id: number
  name: string
  order: number
  optGroup: boolean
  groupID: number | null
  image: string
}

export type GroupedCategory = {
  id: number
  name: string
  order: number
  image: string
  children: CategoryProps[]
}

export type UserProps = {
  id: string
  created_at: string
  email: string
  firstName: string
  lastName: string
  contact: string
  payment: string | null
}

export type AddrProps = {
  id: string
  index: number
  firstName: string
  lastName: string
  address: string
  contact: string
  street: string
  postalCode: string
  city: string
  country: string
  select: boolean
}

export type BannerProps = {
  id: number
  title: string
  text: string
  image: string | File | null
  order: number
  buttonName: string
  buttonLink: string
}

export type UserSelectionProps = {
  id: number
  size: number
  color: number
  qnt?: number
}

export type OrderProps = {
  orderId?: string
  userId: string
  status: string
  totalAmount: number
  discount: number
  paidAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingFee: number
  transactionId: string
  shippingAddr: string
  billingAddr: string
  shippingName: string
  billingName: string
  shippingContact: string
  billingContact: string
  created_at?: string
}

export type OrderedProductProps = {
  orderId?: string
  productId: number
  size: string
  color: string
  quantity: number
  total: number
}

export type SortedOrderProps = {
  orderId?: string
  userId: string
  status: string
  totalAmount: number
  discount: number
  paidAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingFee: number
  transactionId: string
  shippingAddr: string
  billingAddr: string
  shippingName: string
  billingName: string
  shippingContact: string
  billingContact: string
  created_at?: string
  products: SortedOrderProductProps[]
  dateProcessingCompleted?: string,
  dateShipped?: string,
  dateDelivered?: string,
}

export type SortedOrderProductProps = {
  id: number
  name: string
  price: number
  color: string
  colorIndex: number
  size: string
  image: string
  category: string
  categoryGroup: string
  qnt: number
  total: number
}