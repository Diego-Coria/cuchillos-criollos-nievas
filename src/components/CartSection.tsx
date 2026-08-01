import { useMemo, useState, type FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { brand } from '../data/catalog'
import {
  buildWhatsAppLink,
  emptyCustomer,
  sendOrderEmail,
} from '../lib/order'
import { formatPrice, formatProductPrice } from '../lib/format'
import { sellerEmail, whatsappNumber } from '../lib/supabase'
import type { CustomerData } from '../types'
import './CartSection.css'

export function CartSection() {
  const { items, total, hasQuotes, updateQuantity, removeItem, clearCart } =
    useCart()
  const [customer, setCustomer] = useState<CustomerData>(emptyCustomer)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const order = useMemo(
    () => ({ customer, items, total, hasQuoteItems: hasQuotes }),
    [customer, items, total, hasQuotes],
  )

  function onChange<K extends keyof CustomerData>(
    key: K,
    value: CustomerData[K],
  ) {
    setCustomer((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (items.length === 0 || status === 'sending') return

    setStatus('sending')
    setErrorMessage(null)

    try {
      await sendOrderEmail(order)
      setStatus('ok')
      clearCart()
      setCustomer(emptyCustomer())
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el pedido. Probá de nuevo o usá WhatsApp.',
      )
    }
  }

  const whatsappHref =
    whatsappNumber && items.length > 0
      ? buildWhatsAppLink(order, whatsappNumber)
      : null

  return (
    <section id="carrito" className="section cart-section">
      <div className="section__inner">
        <h2>Carrito de pedidos</h2>
        <p className="section__lead">
          No hay pago online. Al confirmar, se envía un email automático a
          Francisco y otro a tu correo con el resumen del pedido. También podés
          mandarlo por WhatsApp.
        </p>

        {status === 'ok' ? (
          <div className="cart-success">
            <p>
              Pedido enviado. Francisco recibió una copia en{' '}
              <strong>{sellerEmail}</strong> y vos también vas a recibir un
              email de confirmación.
            </p>
            <p>
              Te van a responder con los datos de pago. Recordá: {brand.payment}
            </p>
          </div>
        ) : null}

        {items.length === 0 && status !== 'ok' ? (
          <p className="cart-empty">
            Tu carrito está vacío. Agregá productos desde el catálogo.
          </p>
        ) : null}

        {items.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div>
                    <strong>{item.product.name}</strong>
                    <p>{formatProductPrice(item.product.price)} c/u</p>
                  </div>
                  <div className="cart-item__controls">
                    <label>
                      Cant.
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            Number(e.target.value) || 1,
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => removeItem(item.product.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <span>
                  {hasQuotes ? 'Total estimado (con precio)' : 'Total estimado'}
                </span>
                <strong>{formatPrice(total)}</strong>
              </div>
              {hasQuotes ? (
                <p className="hint">
                  Hay piezas a consultar: Francisco te cotiza según lo que
                  pediste.
                </p>
              ) : null}
              <button type="button" className="ghost" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>

            <form className="cart-form" onSubmit={(e) => void handleSubmit(e)}>
              <h3>Datos del comprador</h3>
              <label>
                Nombre completo
                <input
                  required
                  value={customer.name}
                  onChange={(e) => onChange('name', e.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={customer.email}
                  onChange={(e) => onChange('email', e.target.value)}
                />
              </label>
              <label>
                Teléfono / WhatsApp
                <input
                  required
                  value={customer.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                />
              </label>
              <label>
                Ciudad / Provincia
                <input
                  required
                  value={customer.city}
                  onChange={(e) => onChange('city', e.target.value)}
                />
              </label>
              <label>
                Notas (personalización, retiro, etc.)
                <textarea
                  rows={3}
                  value={customer.notes}
                  onChange={(e) => onChange('notes', e.target.value)}
                  placeholder="Ej: iniciales FN, cabo octogonal, retiro en taller..."
                />
              </label>

              <button
                type="submit"
                className="primary"
                disabled={status === 'sending'}
              >
                {status === 'sending'
                  ? 'Enviando pedido…'
                  : 'Confirmar pedido por email'}
              </button>

              {whatsappHref ? (
                <a
                  className="whatsapp-btn"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Enviar pedido por WhatsApp
                </a>
              ) : (
                <p className="hint">
                  Para activar WhatsApp, cargá el número en{' '}
                  <code>VITE_WHATSAPP_NUMBER</code>.
                </p>
              )}

              {status === 'error' && errorMessage ? (
                <div className="cart-error">{errorMessage}</div>
              ) : null}
            </form>
          </div>
        ) : null}
      </div>
    </section>
  )
}
