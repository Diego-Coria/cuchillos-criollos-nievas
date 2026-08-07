import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import { brand } from '../data/catalog'
import './QrPage.css'

function resolveSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined
  if (configured && configured.trim() && !configured.includes('tu-dominio')) {
    return configured.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export function QrPage() {
  const siteUrl = useMemo(() => resolveSiteUrl(), [])
  const [dataUrl, setDataUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function generate() {
      try {
        const url = await QRCode.toDataURL(siteUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: '#1b140d',
            light: '#fff8eb',
          },
        })
        if (!cancelled) {
          setDataUrl(url)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'No se pudo generar el QR',
          )
        }
      }
    }

    if (siteUrl) void generate()
    return () => {
      cancelled = true
    }
  }, [siteUrl])

  function handlePrint() {
    window.print()
  }

  return (
    <main className="qr-page">
      <div className="qr-page__inner">
        <div className="qr-page__top no-print">
          <div>
            <h1>Código QR del sitio</h1>
            <p>
              Escaneá este código para abrir la web de {brand.name}. Podés
              imprimirlo o descargarlo para carteles, ferias o el taller.
            </p>
          </div>
          <div className="qr-page__links">
            <Link to="/">Volver al sitio</Link>
          </div>
        </div>

        <div className="qr-card">
          <p className="qr-card__brand">{brand.name}</p>
          {dataUrl ? (
            <img src={dataUrl} alt={`Código QR hacia ${siteUrl}`} />
          ) : (
            <p className="muted">Generando QR…</p>
          )}
          <p className="qr-card__url">{siteUrl}</p>
          {error ? <p className="warning">{error}</p> : null}
        </div>

        <div className="qr-actions no-print">
          {dataUrl ? (
            <a className="btn-primary" href={dataUrl} download="cuchillos-criollos-nievas-qr.png">
              Descargar PNG
            </a>
          ) : null}
          <button type="button" className="btn-secondary" onClick={handlePrint}>
            Imprimir
          </button>
        </div>

        <ol className="qr-steps no-print">
          <li>Publicá el sitio (por ejemplo en Vercel).</li>
          <li>
            Configurá <code>VITE_SITE_URL</code> con la URL pública definitiva.
          </li>
          <li>Volvé a esta página, descargá o imprimí el QR.</li>
          <li>Usalo en ferias, tarjetas o el taller: al escanearlo abre la web.</li>
        </ol>
      </div>
    </main>
  )
}
