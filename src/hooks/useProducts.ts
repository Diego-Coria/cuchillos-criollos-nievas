import { useEffect, useState } from 'react'
import { seedProducts } from '../data/catalog'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [source, setSource] = useState<'seed' | 'supabase'>('seed')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase!
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setProducts(seedProducts)
        setSource('seed')
      } else if (data && data.length > 0) {
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
        setSource('supabase')
      } else {
        setProducts(seedProducts)
        setSource('seed')
      }

      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, source, error }
}
