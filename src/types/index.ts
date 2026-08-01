export type ProductCategory =
  | 'cuchillos-cintura'
  | 'verijeros'
  | 'facones'
  | 'accesorios'
  | 'personalizacion'
  | 'otros-trabajos'

export type ProductLine = 'clasica' | 'airon-solingen' | null

export interface Product {
  id: string
  name: string
  description: string
  /** null = precio a consultar según pedido */
  price: number | null
  bladeLengthCm: number | null
  category: ProductCategory
  line: ProductLine
  imageUrl: string | null
  imageUrls: string[]
  sortOrder: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CustomerData {
  name: string
  email: string
  phone: string
  city: string
  notes: string
}

export interface OrderPayload {
  customer: CustomerData
  items: CartItem[]
  total: number
  hasQuoteItems: boolean
}
