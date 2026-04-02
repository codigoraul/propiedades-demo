export const prerender = false;
// src/pages/api/crear-propiedad.ts
import type { APIRoute } from 'astro';

const WP_API  = import.meta.env.WP_API_URL || 'http://localhost:10008/wp-json/wp/v2';
const WP_USER = import.meta.env.WP_APP_USER;
const WP_PASS = import.meta.env.WP_APP_PASS;

// Límites de seguridad
const MAX_FOTOS     = 5;
const MAX_FOTO_MB   = 3;
const MAX_FOTO_BYTES = MAX_FOTO_MB * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {

  const headers = { 'Content-Type': 'application/json' };

  try {
    const formData = await request.formData();

    // ── Validar campos obligatorios ──────────────
    const titulo    = formData.get('titulo')?.toString().trim();
    const tipoOp    = formData.get('tipo_operacion')?.toString();
    const tipoProp  = formData.get('tipo_propiedad')?.toString();
    const precioUF  = formData.get('precio_uf')?.toString();
    const metros    = formData.get('metros_construidos')?.toString();
    const ciudad    = formData.get('ciudad')?.toString().trim();
    const corrNombre = formData.get('corredor_nombre')?.toString().trim();
    const corrTel   = formData.get('corredor_telefono')?.toString().trim();
    const descripcion = formData.get('descripcion')?.toString().trim() || '';

    if (!titulo || !tipoOp || !tipoProp || !precioUF || !metros || !ciudad || !corrNombre || !corrTel) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios.' }), { status: 400, headers });
    }

    // ── Validar fotos ────────────────────────────
    const fotos = formData.getAll('fotos') as File[];
    const fotosValidas = fotos.filter(f => f.size > 0);

    if (fotosValidas.length > MAX_FOTOS) {
      return new Response(JSON.stringify({ error: `Máximo ${MAX_FOTOS} fotos permitidas.` }), { status: 400, headers });
    }
    for (const foto of fotosValidas) {
      if (foto.size > MAX_FOTO_BYTES) {
        return new Response(JSON.stringify({ error: `Cada foto debe pesar menos de ${MAX_FOTO_MB}MB.` }), { status: 400, headers });
      }
      if (!['image/jpeg','image/png','image/webp'].includes(foto.type)) {
        return new Response(JSON.stringify({ error: 'Solo se permiten fotos JPG, PNG o WebP.' }), { status: 400, headers });
      }
    }

    // ── Auth header ──────────────────────────────
    const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

    // ── Subir fotos a la Media Library ───────────
    const mediaIds: number[] = [];

    for (const foto of fotosValidas) {
      const buffer = await foto.arrayBuffer();
      const mediaRes = await fetch(`${WP_API}/media`, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Disposition': `attachment; filename="${foto.name}"`,
          'Content-Type': foto.type,
        },
        body: buffer,
      });
      if (mediaRes.ok) {
        const media = await mediaRes.json();
        mediaIds.push(media.id);
      }
    }

    // ── Crear propiedad como BORRADOR ────────────
    const acfData: Record<string, any> = {
      tipo_operacion:    tipoOp,
      tipo_propiedad:    tipoProp,
      precio_uf:         parseFloat(precioUF),
      metros_construidos: parseFloat(metros),
      ciudad:            ciudad,
      corredor_nombre:   corrNombre,
      corredor_telefono: corrTel,
      descripcion_larga: descripcion,
      destacada:         false,
    };

    // Campos opcionales
    const dormitorios = formData.get('dormitorios')?.toString();
    const banos       = formData.get('banos')?.toString();
    const estac       = formData.get('estacionamientos')?.toString();
    const sector      = formData.get('sector')?.toString().trim();
    const corrEmail   = formData.get('corredor_email')?.toString().trim();

    if (dormitorios) acfData.dormitorios = parseInt(dormitorios);
    if (banos)       acfData.banos = parseInt(banos);
    if (estac)       acfData.estacionamientos = parseInt(estac);
    if (sector)      acfData.sector = sector;
    if (corrEmail)   acfData.corredor_email = corrEmail;

    // Imagen principal = primera foto subida
    if (mediaIds.length > 0) {
      acfData.imagen_principal = mediaIds[0];
    }

    const propRes = await fetch(`${WP_API.replace('/wp/v2', '')}/wp/v2/propiedades`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title:   titulo,
        status:  'draft',   // ← BORRADOR — requiere aprobación
        excerpt: descripcion.substring(0, 160),
        acf:     acfData,
        featured_media: mediaIds[0] ?? 0,
      }),
    });

    if (!propRes.ok) {
      const err = await propRes.json();
      console.error('[crear-propiedad]', err);
      return new Response(JSON.stringify({ error: 'Error al crear la propiedad en WordPress.' }), { status: 500, headers });
    }

    const prop = await propRes.json();

    return new Response(JSON.stringify({
      ok: true,
      id: prop.id,
      mensaje: 'Propiedad enviada correctamente. Será revisada y publicada pronto.',
    }), { status: 200, headers });

  } catch (err: any) {
    console.error('[crear-propiedad]', err);
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), { status: 500, headers });
  }
};
