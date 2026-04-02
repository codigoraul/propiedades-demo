/**
 * wp-api.js — Utilidades para consultar WordPress Headless
 * Ubicación: src/lib/wp-api.js
 */

const WP_API = import.meta.env.WP_API_URL || 'http://localhost:10008/wp-json/wp/v2';

// ── Tipos TypeScript (JSDoc para autocompletado) ──────────────
/**
 * @typedef {Object} Propiedad
 * @property {number} id
 * @property {string} slug
 * @property {{rendered: string}} title
 * @property {{rendered: string}} [excerpt]
 * @property {string|null} thumbnail_url
 * @property {Object} acf
 * @property {string} acf.tipo_operacion
 * @property {string} acf.tipo_propiedad
 * @property {number} [acf.precio_uf]
 * @property {number} [acf.precio_arriendo_uf]
 * @property {number} [acf.precio_pesos]
 * @property {number} [acf.dormitorios]
 * @property {number} [acf.banos]
 * @property {number} [acf.estacionamientos]
 * @property {number} [acf.metros_construidos]
 * @property {number} [acf.metros_terreno]
 * @property {string} [acf.ciudad]
 * @property {string} [acf.sector]
 * @property {string} [acf.region]
 * @property {string} [acf.direccion]
 * @property {string[]} [acf.amenidades]
 * @property {boolean} [acf.destacada]
 * @property {{url: string}} [acf.imagen_principal]
 * @property {{url: string, alt?: string}[]} [acf.galeria]
 * @property {string} [acf.descripcion_larga]
 * @property {string} [acf.video_url]
 * @property {string} [acf.codigo_interno]
 * @property {number|string} [acf.piso]
 * @property {string} [acf.antiguedad]
 * @property {string} [acf.corredor_nombre]
 * @property {string} [acf.corredor_telefono]
 * @property {string} [acf.corredor_email]
 * @property {{url?: string}} [acf.corredor_foto]
 */

// ── Helper fetch con manejo de errores ───────────────────────
async function wpFetch(endpoint) {
  try {
    const res = await fetch(`${WP_API}${endpoint}`);
    if (!res.ok) throw new Error(`WP API error: ${res.status} — ${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error('[wp-api]', err.message);
    return null;
  }
}

// ── OBTENER TODAS LAS PROPIEDADES ────────────────────────────
/**
 * @param {Object} filtros
 * @param {string} [filtros.tipo_operacion]  'venta' | 'arriendo'
 * @param {string} [filtros.tipo_propiedad]  'casa' | 'departamento' | ...
 * @param {boolean} [filtros.destacada]
 * @param {number}  [filtros.precio_max_uf]
 * @param {number}  [filtros.per_page]
 * @param {number}  [filtros.page]
 * @returns {Promise<Propiedad[]>}
 */
export async function getPropiedades(filtros = {}) {
  const params = new URLSearchParams();
  params.set('per_page', filtros.per_page ?? 12);
  params.set('page',     filtros.page ?? 1);
  // params.set('_embed',   '1');   // incluye featured_media embebido
  params.set('acf', 'true');      // incluye campos ACF
  params.set('_fields', 'id,slug,title,excerpt,thumbnail_url,acf');

  if (filtros.tipo_operacion) params.set('tipo_operacion', filtros.tipo_operacion);
  if (filtros.tipo_propiedad) params.set('tipo_propiedad', filtros.tipo_propiedad);
  if (filtros.destacada)      params.set('destacada', '1');
  if (filtros.precio_max_uf)  params.set('precio_max_uf', filtros.precio_max_uf);

  return wpFetch(`/propiedades?${params.toString()}`) ?? [];
}

// ── OBTENER PROPIEDAD POR SLUG ────────────────────────────────
/**
 * @param {string} slug
 * @returns {Promise<Propiedad|null>}
 */
export async function getPropiedadBySlug(slug) {
  const params = new URLSearchParams();
  params.set('slug', slug);
  params.set('acf', 'true');
  params.set('_fields', 'id,slug,title,excerpt,thumbnail_url,acf');
  const res = await wpFetch(`/propiedades?${params.toString()}`);
  if (!res || !res.length) return null;
  return res[0];
}

// ── OBTENER PROPIEDADES DESTACADAS ───────────────────────────
export async function getPropiedadesDestacadas(limit = 4) {
  return getPropiedades({ destacada: true, per_page: limit });
}

// ── OBTENER CIUDADES (TAXONOMÍA) ──────────────────────────────
export async function getCiudades() {
  return wpFetch('/ciudad?per_page=50&hide_empty=true') ?? [];
}

// ── HELPERS DE FORMATO ────────────────────────────────────────

/** Formatea precio UF con separador de miles */
export function formatUF(valor) {
  if (!valor) return '—';
  return `UF ${Number(valor).toLocaleString('es-CL')}`;
}

/** Formatea precio en pesos */
export function formatPesos(valor) {
  if (!valor) return '';
  return `$${Number(valor).toLocaleString('es-CL')}`;
}

/** Genera link de WhatsApp para el corredor */
export function whatsappLink(telefono, propiedad) {
  const num = telefono.replace(/\D/g, '');
  const msg = encodeURIComponent(`Hola, me interesa la propiedad: ${propiedad}`);
  return `https://wa.me/${num}?text=${msg}`;
}

/** Retorna el label legible de tipo de propiedad */
export function labelTipo(tipo) {
  const map = {
    casa: 'Casa',
    departamento: 'Departamento',
    terreno: 'Terreno',
    oficina: 'Oficina',
    local_comercial: 'Local Comercial',
    bodega: 'Bodega',
    parcela: 'Parcela',
  };
  return map[tipo] ?? tipo;
}

/** Retorna emoji según tipo de propiedad */
export function emojiTipo(tipo) {
  const map = {
    casa: '🏠',
    departamento: '🏢',
    terreno: '🌿',
    oficina: '💼',
    local_comercial: '🏪',
    bodega: '📦',
    parcela: '🌾',
  };
  return map[tipo] ?? '🏠';
}
