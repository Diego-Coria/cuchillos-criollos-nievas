import type { CartItem, CustomerData, OrderPayload } from '../types'
import { formatPrice, formatProductPrice } from './format'
import { brand } from '../data/catalog'

export function buildOrderSummary(order: OrderPayload): string {
  const lines = order.items.map((item) => {
    const unit =
      item.product.price === null
        ? 'a consultar'
        : formatPrice(item.product.price * item.quantity)
    return `• ${item.product.name} x${item.quantity} — ${unit}`
  })

  const totalLine = order.hasQuoteItems
    ? `Total estimado (solo ítems con precio): ${formatPrice(order.total)}` +
      '\nHay piezas a consultar: Francisco cotiza según el pedido.'
    : `Total estimado: ${formatPrice(order.total)}`

  return [
    `Pedido — ${brand.name}`,
    '',
    `Cliente: ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    `Teléfono: ${order.customer.phone}`,
    `Ciudad: ${order.customer.city}`,
    order.customer.notes ? `Notas: ${order.customer.notes}` : null,
    '',
    'Productos:',
    ...lines,
    '',
    totalLine,
    '',
    `Entrega: ${brand.delivery}`,
    `Pago: ${brand.payment}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildWhatsAppLink(
  order: OrderPayload,
  phoneNumber: string,
): string {
  const text = encodeURIComponent(buildOrderSummary(order))
  const digits = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${text}`
}

export function toOrderApiPayload(order: OrderPayload) {
  return {
    customer: order.customer,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
    })),
    total: order.total,
    hasQuoteItems: order.hasQuoteItems,
  }
}

export async function sendOrderEmail(order: OrderPayload): Promise<void> {
  const response = await fetch('/api/send-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toOrderApiPayload(order)),
  })

  const data = (await response.json().catch(() => null)) as {
    error?: string
  } | null

  if (!response.ok) {
    throw new Error(data?.error || 'No se pudo enviar el pedido por email')
  }
}

export function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    if (item.product.price === null) return sum
    return sum + item.product.price * item.quantity
  }, 0)
}

export function hasQuoteItems(items: CartItem[]): boolean {
  return items.some((item) => item.product.price === null)
}

export function emptyCustomer(): CustomerData {
  return {
    name: '',
    email: '',
    phone: '',
    city: '',
    notes: '',
  }
}

export { formatProductPrice }
