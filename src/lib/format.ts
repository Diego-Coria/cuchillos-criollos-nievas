export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatProductPrice(price: number | null): string {
  if (price === null) return 'Precio a consultar'
  return formatPrice(price)
}
