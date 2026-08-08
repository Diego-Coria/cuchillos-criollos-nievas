# Cuchillos Criollos Nievas

Sitio web de catálogo y pedidos para **Francisco Nievas**, artesano orfebre.

## Stack

- React + Vite + TypeScript
- React Router
- CSS propio (estilo criollo / artesanal)
- Supabase (catálogo y panel admin)
- Pedidos por email (`mailto`) y WhatsApp (`wa.me`) sin pago online

## Qué incluye

- Inicio, Quiénes somos, Productos, Cómo comprar, Carrito
- Desplegables por categoría y, en cuchillos de cintura, por línea
- Carrito con datos del comprador
- Confirmación por email al vendedor (`francisconievas1985@gmail.com`)
- Botón de WhatsApp (gratis, sin API de pago)
- Panel `/admin` para editar precios y fotos (productos a pedido, sin stock)
- Página `/qr` para generar, descargar e imprimir el código QR del sitio
- Diseño mobile-first (pensado para celulares de distintos tamaños)
- Espacio reservado para logo en el header

## Arranque local

```bash
npm install
npm run dev
```

Copiá `.env.example` a `.env` y completá:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SELLER_EMAIL=francisconievas1985@gmail.com
VITE_WHATSAPP_NUMBER=54911XXXXXXXX
VITE_SITE_URL=https://tu-dominio.vercel.app
```

Sin Supabase, la web igual funciona con el catálogo local de respaldo.

## Código QR

1. Publicá el sitio (recomendado: Vercel).
2. Configurá `VITE_SITE_URL` con la URL pública definitiva.
3. Abrí `/qr` (también hay un link desde `/admin`).
4. Descargá el PNG o imprimilo para ferias, tarjetas o el taller.

Mientras no haya dominio, `/qr` usa la URL actual del navegador (útil para probar en local con el celular en la misma red).

## Mobile

La web está pensada primero para celular:

- Menú hamburguesa en pantallas chicas
- Botones e inputs táctiles (mínimo ~44px)
- Tipografía fluida (`clamp`)
- Evita zoom automático de iOS en formularios
- Soporte de safe-area (notch / barra inferior)

## Supabase

1. Creá un proyecto en Supabase.
2. Ejecutá `supabase/schema.sql` en el SQL Editor.
3. Creá un usuario (Authentication → Users) para Francisco.
4. Pegá URL y anon key en `.env`.

## Datos bancarios

Por seguridad, **no** se muestran en pantalla ni van hardcodeados en el código.  
El flujo actual abre el correo del comprador/vendedor con el resumen del pedido; Francisco responde con los datos de pago.  
Más adelante se puede automatizar el email de respuesta con Resend / Edge Function sin exponer CBU/alias en el frontend.

