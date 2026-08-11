import type { Product } from '../types'

function photos(id: string, count: number, ext = 'jpeg'): string[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return `/products/${id}/${n}.${ext}`
  })
}

function withImages(
  product: Omit<Product, 'imageUrl' | 'imageUrls'> & {
    imageCount?: number
  },
): Product {
  const imageUrls =
    product.imageCount && product.imageCount > 0
      ? photos(product.id, product.imageCount)
      : []
  const { imageCount: _ignored, ...rest } = product
  return {
    ...rest,
    imageUrl: imageUrls[0] ?? null,
    imageUrls,
  }
}

/** Catálogo local. Productos a pedido; “otros trabajos” sin precio fijo. */
export const seedProducts: Product[] = [
  withImages({
    id: 'chaja-26',
    name: 'El Chajá — 26 cm',
    description: 'Línea Clásica. Ideal para uso diario, asado y campo.',
    price: 299000,
    bladeLengthCm: 26,
    category: 'cuchillos-cintura',
    line: 'clasica',
    sortOrder: 1,
    imageCount: 2,
  }),
  withImages({
    id: 'chaja-30',
    name: 'El Chajá — 30 cm',
    description: 'Línea Clásica. Ideal para uso diario, asado y campo.',
    price: 319000,
    bladeLengthCm: 30,
    category: 'cuchillos-cintura',
    line: 'clasica',
    sortOrder: 2,
    imageCount: 5,
  }),
  withImages({
    id: 'airon-26',
    name: 'Airon Solingen — 26 cm',
    description: 'Línea Acero Airon Solingen. Más calidad y durabilidad.',
    price: 379000,
    bladeLengthCm: 26,
    category: 'cuchillos-cintura',
    line: 'airon-solingen',
    sortOrder: 3,
  }),
  withImages({
    id: 'airon-30',
    name: 'Airon Solingen — 30 cm',
    description: 'Línea Acero Airon Solingen. Más calidad y durabilidad.',
    price: 399000,
    bladeLengthCm: 30,
    category: 'cuchillos-cintura',
    line: 'airon-solingen',
    sortOrder: 4,
    imageCount: 2,
  }),
  withImages({
    id: 'verijero-15',
    name: 'Verijero Airon Solingen — 15 cm',
    description: 'Precisión y manejo. De lujo, ágil y funcional.',
    price: 219000,
    bladeLengthCm: 15,
    category: 'verijeros',
    line: 'airon-solingen',
    sortOrder: 5,
    imageCount: 6,
  }),
  withImages({
    id: 'verijero-18',
    name: 'Verijero Airon Solingen — 18 cm',
    description: 'Precisión y manejo. De lujo, ágil y funcional.',
    price: 279000,
    bladeLengthCm: 18,
    category: 'verijeros',
    line: 'airon-solingen',
    sortOrder: 6,
    imageCount: 5,
  }),
  withImages({
    id: 'facon-picasso',
    name: 'Facón “Picasso” — 30 cm',
    description: 'Presencia, tradición y respeto.',
    price: 489000,
    bladeLengthCm: 30,
    category: 'facones',
    line: null,
    sortOrder: 7,
  }),
  withImages({
    id: 'facon-caronero',
    name: 'Facón “Caronero” — 50 cm',
    description: 'Presencia, tradición y respeto.',
    price: 529000,
    bladeLengthCm: 50,
    category: 'facones',
    line: null,
    sortOrder: 8,
    imageCount: 6,
  }),
  withImages({
    id: 'chaira-25',
    name: 'Chaira personalizada — 25 cm',
    description: 'Accesorio artesanal para afilado.',
    price: 129000,
    bladeLengthCm: 25,
    category: 'accesorios',
    line: null,
    sortOrder: 9,
  }),
  withImages({
    id: 'cabo-especial',
    name: 'Cabo especial (cuadrado u octogonal)',
    description: 'Personalización adicional al cuchillo.',
    price: 35000,
    bladeLengthCm: null,
    category: 'personalizacion',
    line: null,
    sortOrder: 10,
  }),
  withImages({
    id: 'dogo',
    name: 'Cuchillo Dogo',
    description:
      'Pieza artesanal a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 11,
    imageCount: 2,
  }),
  withImages({
    id: 'pitbull',
    name: 'Cuchillo Pitbull',
    description:
      'Pieza artesanal a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 12,
    imageCount: 12,
  }),
  withImages({
    id: 'patrios',
    name: 'Cuchillos Patrios',
    description:
      'Piezas artesanales a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 13,
    imageCount: 6,
  }),
  withImages({
    id: 'bagual',
    name: 'El Bagual — cuchillo de cintura',
    description:
      'Pieza artesanal a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 14,
    imageCount: 4,
  }),
  withImages({
    id: 'border-collie',
    name: 'Cuchillo Border Collie',
    description:
      'Pieza artesanal a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 15,
    imageCount: 3,
  }),
  withImages({
    id: 'centro-rastra',
    name: 'Centro de rastra',
    description:
      'Trabajo de orfebrería a medida. El precio se define según el pedido del cliente.',
    price: null,
    bladeLengthCm: null,
    category: 'otros-trabajos',
    line: null,
    sortOrder: 16,
    imageCount: 1,
  }),
]

export const categoryLabels: Record<Product['category'], string> = {
  'cuchillos-cintura': 'Cuchillos de cintura',
  verijeros: 'Verijeros',
  facones: 'Facones',
  accesorios: 'Accesorios',
  personalizacion: 'Personalización',
  'otros-trabajos': 'Otros trabajos',
}

export const lineLabels: Record<NonNullable<Product['line']>, string> = {
  clasica: 'Línea Clásica',
  'airon-solingen': 'Línea Acero Airon Solingen',
}

export const socialLinks = {
  facebook: 'https://www.facebook.com/cuchillosnievas/?mibextid=ZbWKwL',
  instagram:
    'https://www.instagram.com/cuchillos_nievas?utm_source=qr',
  tiktok: 'https://www.tiktok.com/@cuchilloscriollosnievas?_t=8fUXgVMmYEQ&_r=1',
}

export const brand = {
  name: 'Cuchillos Criollos Nievas',
  artisan: 'Francisco Nievas',
  tagline: 'Piezas artesanales únicas hechas para durar toda la vida',
  about: `Cuchillos Criollos Nievas nació de una pasión que pasó de padre a hijo.

Fue mi padre quien me enseñó el oficio de la orfebrería y, más importante aún, quien me transmitió el amor por nuestras raíces criollas, el campo, las tradiciones y el respeto por la cultura gaucha. Gracias a él descubrí un camino que con los años se convirtió en mi forma de vida.

Durante mucho tiempo nuestros cuchillos se encontraban únicamente en las fiestas criollas y jineteadas de todo el país. Mi padre recorría cada encuentro con su puesto, llevando cuchillos, pilchas y el trabajo de muchos artesanos argentinos a cada rincón donde se vivía la tradición.

Con el paso de los años seguí perfeccionándome, estudiando orfebrería y platería para mejorar cada detalle de mi trabajo y ofrecer piezas de la mayor calidad posible.

Pero Cuchillos Criollos Nievas no es solamente el trabajo de un artesano. Es el resultado del esfuerzo de grandes colegas de todo nuestro país. Trabajamos con hojas forjadas artesanalmente y tratadas térmicamente por reconocidos maestros cuchilleros argentinos. Del mismo modo, nuestras vainas y trabajos de soguería y talabartería son realizados junto a destacados artesanos que comparten el mismo compromiso con la calidad y la tradición.

Cada cuchillo que entregamos representa horas de trabajo, experiencia y el orgullo de mantener vivos los oficios tradicionales argentinos.

Nuestra misión es llevar la tradición criolla a cada rincón del país y del mundo, ofreciendo cuchillos únicos, hechos a mano, para que cada criollo pueda tener una pieza que lo acompañe toda la vida.

Porque más que fabricar cuchillos, preservamos una historia, un oficio y una forma de vivir nuestras raíces.`,
  delivery: 'Entre 45 y 60 días, porque cada pedido se hace a medida.',
  payment:
    '50% de seña (transferencia, Mercado Pago o Rapipago) y el resto antes de entregar.',
  shipping:
    'Envíos a todo el país por Correo Argentino, o retiro en el taller de Avellaneda, Buenos Aires.',
  personalization:
    'Cabo, iniciales y vaina: cada parte se puede adaptar para que sea exclusivo tuyo. El grabado de iniciales está incluido.',
}
