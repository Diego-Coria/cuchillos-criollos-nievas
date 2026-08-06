import { brand, socialLinks } from '../data/catalog'
import { useProducts } from '../hooks/useProducts'
import { ProductAccordion } from '../components/ProductAccordion'
import { CartSection } from '../components/CartSection'
import './HomePage.css'

export function HomePage() {
  const { products, loading, source, error } = useProducts()

  return (
    <main>
      <section id="inicio" className="hero">
        <div className="hero__content">
          <p className="eyebrow">Platería criolla</p>
          <h1 className="hero__brand">{brand.name}</h1>
          <p className="hero__tagline">{brand.tagline}</p>
          <div className="hero__actions">
            <a className="btn-primary" href="#productos">
              Ver productos
            </a>
            <a className="btn-secondary" href="#como-comprar">
              Cómo comprar
            </a>
          </div>
        </div>
      </section>

      <section id="quienes-somos" className="section about-section">
        <div className="section__inner">
          <h2>Quiénes somos</h2>
          <div className="about-layout">
            <figure className="about-photo about-photo--left">
              <img
                src="/about/taller-familia.png"
                alt="Francisco Nievas junto a su padre en el taller"
                loading="lazy"
              />
            </figure>

            <div className="about-copy">
              {brand.about.split(/\n\s*\n/).map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph.trim()}</p>
              ))}
              <p className="muted">
                Abrazo criollo — {brand.artisan}, artesano orfebre.
              </p>
              <div className="social-row">
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a href={socialLinks.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </div>
            </div>

            <figure className="about-photo about-photo--right">
              <img
                src="/about/trabajo-orfebreria.png"
                alt="Francisco Nievas trabajando la orfebrería en el taller"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <section id="productos" className="section">
        <div className="section__inner">
          <h2>Productos</h2>
          <p className="section__lead">
            Abrí cada sección para ver medidas y precios. Todas las piezas se
            trabajan a medida.
          </p>
          {loading ? <p className="muted">Cargando catálogo…</p> : null}
          {error ? (
            <p className="warning">
              No se pudo leer Supabase ({error}). Mostrando catálogo local.
            </p>
          ) : null}
          {!loading ? (
            <p className="source-hint">
              Fuente: {source === 'supabase' ? 'Supabase' : 'catálogo local de respaldo'}
            </p>
          ) : null}
          <ProductAccordion products={products} />
        </div>
      </section>

      <section id="como-comprar" className="section">
        <div className="section__inner">
          <h2>Cómo comprar</h2>
          <div className="info-grid">
            <article>
              <h3>Entrega</h3>
              <p>{brand.delivery}</p>
            </article>
            <article>
              <h3>Pago</h3>
              <p>{brand.payment}</p>
            </article>
            <article>
              <h3>Envío</h3>
              <p>{brand.shipping}</p>
            </article>
            <article>
              <h3>Personalización</h3>
              <p>{brand.personalization}</p>
            </article>
          </div>
        </div>
      </section>

      <CartSection />
    </main>
  )
}
