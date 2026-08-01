import { useState, type MouseEvent } from 'react'
import type { Product } from '../types'
import { formatProductPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { ProductLightbox } from './ProductLightbox'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const images =
    product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : []
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const current = images[index] ?? null
  const isQuote = product.price === null

  function prev(event?: MouseEvent) {
    event?.stopPropagation()
    setIndex((i) => (i - 1 + images.length) % images.length)
  }

  function next(event?: MouseEvent) {
    event?.stopPropagation()
    setIndex((i) => (i + 1) % images.length)
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        {current ? (
          <>
            <button
              type="button"
              className="product-card__open"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Ver fotos de ${product.name} en grande`}
            >
              <img src={current} alt={product.name} loading="lazy" />
            </button>
            {images.length > 1 ? (
              <div className="product-card__gallery">
                <button type="button" onClick={prev} aria-label="Foto anterior">
                  ‹
                </button>
                <span>
                  {index + 1}/{images.length}
                </span>
                <button type="button" onClick={next} aria-label="Foto siguiente">
                  ›
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <span>Foto próximamente</span>
        )}
      </div>
      <div className="product-card__body">
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        {product.bladeLengthCm ? (
          <p className="product-card__meta">Hoja: {product.bladeLengthCm} cm</p>
        ) : null}
        <div className="product-card__footer">
          <strong className={isQuote ? 'is-quote' : undefined}>
            {formatProductPrice(product.price)}
          </strong>
          <button type="button" onClick={() => addItem(product)}>
            {isQuote ? 'Pedir presupuesto' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {lightboxOpen && images.length > 0 ? (
        <ProductLightbox
          title={product.name}
          images={images}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </article>
  )
}
