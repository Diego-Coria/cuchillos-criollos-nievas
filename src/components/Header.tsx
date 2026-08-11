import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { brand } from '../data/catalog'
import { SocialLinksRow } from './SocialIcons'
import './Header.css'

const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#productos', label: 'Productos' },
  { href: '#como-comprar', label: 'Cómo comprar' },
  { href: '#carrito', label: 'Carrito' },
]

export function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#inicio" onClick={closeMenu}>
          <span className="brand__name">{brand.name}</span>
        </a>

        <div className="header-actions">
          <a className="cart-chip" href="#carrito" aria-label="Ir al carrito">
            Carrito
            {count > 0 ? <span className="nav__badge">{count}</span> : null}
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        <nav
          id="main-nav"
          className={`nav ${menuOpen ? 'nav--open' : ''}`}
          aria-label="Principal"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
              {item.href === '#carrito' && count > 0 ? (
                <span className="nav__badge">{count}</span>
              ) : null}
            </a>
          ))}

          <SocialLinksRow className="header-social" onNavigate={closeMenu} />
        </nav>
      </div>
    </header>
  )
}
