import { useMemo, useState } from 'react'
import type { Product } from '../types'
import { categoryLabels, lineLabels } from '../data/catalog'
import { ProductCard } from './ProductCard'
import './ProductAccordion.css'

interface ProductAccordionProps {
  products: Product[]
}

const categoryOrder: Product['category'][] = [
  'cuchillos-cintura',
  'verijeros',
  'facones',
  'accesorios',
  'personalizacion',
  'otros-trabajos',
]

export function ProductAccordion({ products }: ProductAccordionProps) {
  const [openCategory, setOpenCategory] = useState<Product['category'] | null>(
    'cuchillos-cintura',
  )
  const [openLine, setOpenLine] = useState<string | null>('clasica')

  const grouped = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        items: products
          .filter((p) => p.category === category)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }))
      .filter((group) => group.items.length > 0)
  }, [products])

  return (
    <div className="accordion">
      {grouped.map(({ category, items }) => {
        const isOpen = openCategory === category
        const hasLines = items.some((item) => item.line)

        return (
          <section key={category} className="accordion__section">
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenCategory((prev) => (prev === category ? null : category))
              }
            >
              <span>{categoryLabels[category]}</span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen ? (
              <div className="accordion__panel">
                {hasLines ? (
                  (['clasica', 'airon-solingen'] as const).map((line) => {
                    const lineItems = items.filter((item) => item.line === line)
                    if (lineItems.length === 0) return null
                    const lineOpen = openLine === line

                    return (
                      <div key={line} className="accordion__subsection">
                        <button
                          type="button"
                          className="accordion__subtrigger"
                          aria-expanded={lineOpen}
                          onClick={() =>
                            setOpenLine((prev) => (prev === line ? null : line))
                          }
                        >
                          <span>{lineLabels[line]}</span>
                          <span aria-hidden="true">{lineOpen ? '−' : '+'}</span>
                        </button>
                        {lineOpen ? (
                          <div className="product-grid">
                            {lineItems.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })
                ) : (
                  <div className="product-grid">
                    {items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
