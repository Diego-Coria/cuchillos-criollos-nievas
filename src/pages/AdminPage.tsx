import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { seedProducts } from '../data/catalog'
import { formatProductPrice } from '../lib/format'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Product } from '../types'
import './AdminPage.css'

export function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessionEmail(session?.user.email ?? null)
      },
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!sessionEmail || !supabase) return

    async function load() {
      const { data, error } = await supabase!
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        setMessage(`No se pudieron cargar productos: ${error.message}`)
        return
      }

      if (data) {
        setProducts(
          data.map((row) => {
            const priceRaw = row.price
            const price =
              priceRaw === null || priceRaw === undefined
                ? null
                : Number(priceRaw)
            const imageUrl = (row.image_url as string | null) ?? null
            return {
              id: row.id as string,
              name: row.name as string,
              description: (row.description as string) ?? '',
              price: Number.isFinite(price as number) ? price : null,
              bladeLengthCm:
                row.blade_length_cm === null
                  ? null
                  : Number(row.blade_length_cm),
              category: row.category as Product['category'],
              line: (row.line as Product['line']) ?? null,
              imageUrl,
              imageUrls: imageUrl ? [imageUrl] : [],
              sortOrder: Number(row.sort_order ?? 0),
            }
          }),
        )
      }
    }

    void load()
  }, [sessionEmail])

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    if (!supabase) {
      setMessage('Configurá Supabase en el archivo .env para usar el admin.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Sesión iniciada.')
  }

  async function handleLogout() {
    if (!supabase) return
    await supabase.auth.signOut()
    setMessage('Sesión cerrada.')
  }

  async function saveProduct(product: Product) {
    if (!supabase) {
      setMessage(
        'Modo local: los cambios no se guardan hasta configurar Supabase.',
      )
      return
    }

    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      blade_length_cm: product.bladeLengthCm,
      category: product.category,
      line: product.line,
      image_url: product.imageUrl,
      sort_order: product.sortOrder,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(`Guardado: ${product.name}`)
  }

  function updateLocal(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...patch } : product,
      ),
    )
  }

  return (
    <main className="admin-page">
      <div className="admin-page__inner">
        <div className="admin-top">
          <div>
            <h1>Panel administrador</h1>
            <p>
              Acá Francisco puede cambiar precios y fotos sin tocar el código.
              Los productos son a pedido, no hay stock.
            </p>
          </div>
          <div className="admin-top__links">
            <Link to="/">Volver al sitio</Link>
            <Link to="/qr">Código QR</Link>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="admin-banner">
            Supabase todavía no está configurado. Mientras tanto ves el catálogo
            local. Cuando armes el proyecto en Supabase y completes el{' '}
            <code>.env</code>, este panel guarda cambios reales.
          </div>
        ) : null}

        {!sessionEmail ? (
          <form className="admin-login" onSubmit={handleLogin}>
            <h2>Ingresar</h2>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </form>
        ) : (
          <div className="admin-session">
            <p>
              Conectado como <strong>{sessionEmail}</strong>
            </p>
            <button type="button" onClick={() => void handleLogout()}>
              Cerrar sesión
            </button>
          </div>
        )}

        {message ? <p className="admin-message">{message}</p> : null}

        <div className="admin-list">
          {products.map((product) => (
            <article key={product.id} className="admin-card">
              <label>
                Nombre
                <input
                  value={product.name}
                  onChange={(e) =>
                    updateLocal(product.id, { name: e.target.value })
                  }
                />
              </label>
              <label>
                Precio (vacío = a consultar)
                <input
                  type="number"
                  min={0}
                  value={product.price ?? ''}
                  onChange={(e) =>
                    updateLocal(product.id, {
                      price:
                        e.target.value.trim() === ''
                          ? null
                          : Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
              <label>
                URL de imagen
                <input
                  value={product.imageUrl ?? ''}
                  onChange={(e) =>
                    updateLocal(product.id, {
                      imageUrl: e.target.value || null,
                      imageUrls: e.target.value ? [e.target.value] : [],
                    })
                  }
                  placeholder="https://..."
                />
              </label>
              <div className="admin-card__footer">
                <span>{formatProductPrice(product.price)}</span>
                <button type="button" onClick={() => void saveProduct(product)}>
                  Guardar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
