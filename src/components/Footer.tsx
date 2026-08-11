import { brand } from '../data/catalog'
import { SocialLinksRow } from './SocialIcons'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>{brand.name}</strong>
          <p>{brand.artisan} — Artesano orfebre</p>
        </div>
        <SocialLinksRow className="site-footer__social" />
      </div>
      <p className="site-footer__credit">
        Desarrollo:{' '}
        <a
          href="https://www.linkedin.com/in/diego-coria-dev"
          target="_blank"
          rel="noreferrer"
        >
          Diego Coria
        </a>
      </p>
    </footer>
  )
}
