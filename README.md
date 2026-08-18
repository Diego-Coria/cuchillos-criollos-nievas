# Cuchillos Criollos Nievas

Sitio web de catálogo y pedidos para **Francisco Nievas**, artesano orfebre de Avellaneda, Buenos Aires.

**En vivo:** [www.cuchilloscriollosnievas.com](https://www.cuchilloscriollosnievas.com/)

Proyecto real para un cliente: piezas a medida, sin pago online. El comprador arma el pedido en la web y Francisco lo recibe por email automático y/o WhatsApp.

Desarrollo: [Diego Coria](https://www.linkedin.com/in/diego-coria-dev)

---

## El problema

Francisco vende cuchillos criollos, facones y trabajos de platería en ferias y por redes. No tenía una web propia: el catálogo vivía en fotos de WhatsApp e Instagram, y cada pedido se armaba a mano.

Necesitaba algo simple de usar en el celular (la mayoría de sus clientes entra desde ahí), con precios claros, fotos reales y un flujo de pedido que no dependa de un checkout ni de una plataforma de pago.

## La solución

Una SPA mobile-first con catálogo por categorías, carrito persistente y confirmación de pedido por **email transaccional** (Resend, vía función serverless en Vercel) más un atajo a **WhatsApp**.

Decisiones de producto que importan:

- **Sin pago online.** 50% de seña y el resto antes de entregar; los datos bancarios no van en el frontend.
- **Sin stock.** Todo se fabrica a pedido (45–60 días).
- **Catálogo en código.** Evita un backend de base de datos pago y el riesgo de que un plan gratuito se pause cuando el cliente no lo va a mantener.
- **Fotos propias** por producto (lightbox tipo galería).
- **Página `/qr`** para ferias y el taller, apuntando al dominio público.

## Capturas

Próximamente: home, catálogo, detalle de producto, carrito y vista mobile.

## Stack

| Capa | Tecnología |
| --- | --- |
| Front | React 19, TypeScript, Vite, React Router |
| Estilos | CSS propio (tipografía Cinzel + Source Sans 3, tema criollo oscuro) |
| Pedidos | Vercel Serverless (`/api/send-order`) + [Resend](https://resend.com) |
| Contacto | WhatsApp (`wa.me`) con el resumen del pedido |
| Hosting / DNS | Vercel (Hobby) + Cloudflare (`cuchilloscriollosnievas.com`) |

## Qué hay en el sitio

- Inicio, Quiénes somos, Productos, Cómo comprar y Carrito (una sola página con anclas)
- Acordeones por categoría; en cuchillos de cintura, también por línea (Clásica / Airon Solingen)
- Productos a consultar (otros trabajos) junto a piezas con precio fijo
- Lightbox de fotos, botón flotante de WhatsApp y redes (Facebook, Instagram, TikTok)
- Formulario de pedido: nombre, email, teléfono, ciudad y notas de personalización
- Email al vendedor y al comprador al confirmar; el vendedor responde con los datos de pago

## Cómo correrlo en local

```bash
npm install
cp .env.example .env
npm run dev
```

Variables útiles en `.env`:

```env
VITE_WHATSAPP_NUMBER=54911XXXXXXXX
VITE_SITE_URL=https://www.cuchilloscriollosnievas.com
VITE_SELLER_EMAIL=francisconievas1985@gmail.com
```

Los envíos de mail (`RESEND_API_KEY`, `ORDER_FROM_EMAIL`, `SELLER_EMAIL`) se configuran en Vercel, **sin** prefijo `VITE_`, para que la API key no salga al navegador.

```bash
npm run build
```


## Licencia

Código de un encargo privado. El contenido, las fotos y la marca pertenecen a Francisco Nievas.
