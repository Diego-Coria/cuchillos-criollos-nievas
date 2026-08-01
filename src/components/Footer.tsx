import { brand, socialLinks } from '../data/catalog'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>{brand.name}</strong>
          <p>{brand.artisan} — Artesano orfebre</p>
        </div>
        <div className="site-footer__social">
          <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={socialLinks.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
      </div>
    </footer>
  )
}
