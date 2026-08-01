import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { createPortal } from 'react-dom'
import './ProductLightbox.css'

interface ProductLightboxProps {
  title: string
  images: string[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function ProductLightbox({
  title,
  images,
  index,
  onIndexChange,
  onClose,
}: ProductLightboxProps) {
  const titleId = useId()
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const indexRef = useRef(index)
  const imagesLenRef = useRef(images.length)
  const onCloseRef = useRef(onClose)
  const onIndexChangeRef = useRef(onIndexChange)

  indexRef.current = index
  imagesLenRef.current = images.length
  onCloseRef.current = onClose
  onIndexChangeRef.current = onIndexChange

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    window.history.pushState({ productLightbox: true }, '')

    function onPopState() {
      onCloseRef.current()
    }

    function goPrev() {
      const len = imagesLenRef.current
      if (len < 2) return
      const current = indexRef.current
      onIndexChangeRef.current((current - 1 + len) % len)
    }

    function goNext() {
      const len = imagesLenRef.current
      if (len < 2) return
      const current = indexRef.current
      onIndexChangeRef.current((current + 1) % len)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeWithHistory()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function closeWithHistory() {
    const state = window.history.state as { productLightbox?: boolean } | null
    if (state?.productLightbox) {
      window.history.back()
      return
    }
    onClose()
  }

  function onBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeWithHistory()
    }
  }

  function goPrev() {
    if (images.length < 2) return
    onIndexChange((index - 1 + images.length) % images.length)
  }

  function goNext() {
    if (images.length < 2) return
    onIndexChange((index + 1) % images.length)
  }

  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null || images.length < 2) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    if (delta > 0) goPrev()
    else goNext()
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="lightbox__top">
        <p id={titleId} className="lightbox__title">
          {title}
        </p>
        <button
          ref={closeBtnRef}
          type="button"
          className="lightbox__close"
          onClick={closeWithHistory}
          aria-label="Cerrar fotos"
        >
          ✕
        </button>
      </div>

      <div
        className="lightbox__stage"
        onClick={onBackdropClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 ? (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            aria-label="Foto anterior"
          >
            ‹
          </button>
        ) : null}

        <img
          src={images[index]}
          alt={`${title} — foto ${index + 1} de ${images.length}`}
          className="lightbox__image"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 ? (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            aria-label="Foto siguiente"
          >
            ›
          </button>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="lightbox__footer">
          <span className="lightbox__counter">
            {index + 1} / {images.length}
          </span>
          <div
            className="lightbox__thumbs"
            role="tablist"
            aria-label="Miniaturas"
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={
                  i === index
                    ? 'lightbox__thumb lightbox__thumb--active'
                    : 'lightbox__thumb'
                }
                onClick={() => onIndexChange(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
