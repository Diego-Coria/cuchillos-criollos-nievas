import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

type OrderItem = {
  name: string
  quantity: number
  unitPrice: number | null
}

type OrderBody = {
  customer: {
    name: string
    email: string
    phone: string
    city: string
    notes?: string
  }
  items: OrderItem[]
  total: number
  hasQuoteItems: boolean
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildItemsHtml(items: OrderItem[]): string {
  return items
    .map((item) => {
      const price =
        item.unitPrice === null
          ? 'a consultar'
          : formatPrice(item.unitPrice * item.quantity)
      return `<li>${escapeHtml(item.name)} x${item.quantity} — ${price}</li>`
    })
    .join('')
}

function buildItemsText(items: OrderItem[]): string {
  return items
    .map((item) => {
      const price =
        item.unitPrice === null
          ? 'a consultar'
          : formatPrice(item.unitPrice * item.quantity)
      return `• ${item.name} x${item.quantity} — ${price}`
    })
    .join('\n')
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const sellerEmail =
    process.env.SELLER_EMAIL || 'francisconievas1985@gmail.com'
  const fromEmail =
    process.env.ORDER_FROM_EMAIL || 'Cuchillos Criollos Nievas <onboarding@resend.dev>'
  const paymentInstructions =
    process.env.PAYMENT_INSTRUCTIONS ||
    'Francisco te va a responder con los datos de pago (transferencia, Mercado Pago o Rapipago). Recordá: 50% de seña y el resto antes de entregar.'

  if (!apiKey) {
    return res.status(500).json({
      error:
        'Falta configurar RESEND_API_KEY en Vercel. Sin eso no se pueden enviar mails automáticos.',
    })
  }

  const body = req.body as OrderBody
  if (
    !body?.customer?.name ||
    !body?.customer?.email ||
    !body?.customer?.phone ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return res.status(400).json({ error: 'Pedido incompleto' })
  }

  const totalLine = body.hasQuoteItems
    ? `Total estimado (solo ítems con precio): ${formatPrice(body.total)}. Hay piezas a consultar.`
    : `Total estimado: ${formatPrice(body.total)}`

  const notes = body.customer.notes?.trim()
    ? body.customer.notes.trim()
    : 'Sin notas'

  const sellerSubject = `Nuevo pedido — ${body.customer.name} — Cuchillos Criollos Nievas`
  const buyerSubject = `Recibimos tu pedido — Cuchillos Criollos Nievas`

  const sellerText = [
    'Nuevo pedido desde la web',
    '',
    `Cliente: ${body.customer.name}`,
    `Email: ${body.customer.email}`,
    `Teléfono: ${body.customer.phone}`,
    `Ciudad: ${body.customer.city}`,
    `Notas: ${notes}`,
    '',
    'Productos:',
    buildItemsText(body.items),
    '',
    totalLine,
  ].join('\n')

  const buyerText = [
    `Hola ${body.customer.name},`,
    '',
    'Recibimos tu pedido en Cuchillos Criollos Nievas.',
    '',
    'Resumen:',
    buildItemsText(body.items),
    '',
    totalLine,
    '',
    paymentInstructions,
    '',
    'Entrega: entre 45 y 60 días (piezas a medida).',
    'Envíos a todo el país por Correo Argentino, o retiro en Avellaneda.',
    '',
    'Abrazo criollo,',
    'Francisco Nievas',
  ].join('\n')

  const sellerHtml = `
    <h2>Nuevo pedido desde la web</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(body.customer.name)}<br/>
    <strong>Email:</strong> ${escapeHtml(body.customer.email)}<br/>
    <strong>Teléfono:</strong> ${escapeHtml(body.customer.phone)}<br/>
    <strong>Ciudad:</strong> ${escapeHtml(body.customer.city)}<br/>
    <strong>Notas:</strong> ${escapeHtml(notes)}</p>
    <h3>Productos</h3>
    <ul>${buildItemsHtml(body.items)}</ul>
    <p><strong>${escapeHtml(totalLine)}</strong></p>
  `

  const buyerHtml = `
    <p>Hola ${escapeHtml(body.customer.name)},</p>
    <p>Recibimos tu pedido en <strong>Cuchillos Criollos Nievas</strong>.</p>
    <h3>Resumen</h3>
    <ul>${buildItemsHtml(body.items)}</ul>
    <p><strong>${escapeHtml(totalLine)}</strong></p>
    <p>${escapeHtml(paymentInstructions)}</p>
    <p>Entrega: entre 45 y 60 días (piezas a medida).<br/>
    Envíos a todo el país por Correo Argentino, o retiro en Avellaneda.</p>
    <p>Abrazo criollo,<br/>Francisco Nievas</p>
  `

  try {
    const resend = new Resend(apiKey)

    const sellerResult = await resend.emails.send({
      from: fromEmail,
      to: [sellerEmail],
      replyTo: body.customer.email,
      subject: sellerSubject,
      text: sellerText,
      html: sellerHtml,
    })

    if (sellerResult.error) {
      return res.status(502).json({
        error: sellerResult.error.message || 'No se pudo avisar al vendedor',
      })
    }

    const buyerResult = await resend.emails.send({
      from: fromEmail,
      to: [body.customer.email],
      replyTo: sellerEmail,
      subject: buyerSubject,
      text: buyerText,
      html: buyerHtml,
    })

    if (buyerResult.error) {
      return res.status(502).json({
        error:
          buyerResult.error.message ||
          'Se avisó al vendedor, pero falló el mail al comprador',
      })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al enviar el pedido'
    return res.status(500).json({ error: message })
  }
}
