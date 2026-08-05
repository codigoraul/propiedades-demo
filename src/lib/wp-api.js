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
  params.set('per_page', 100); // Obtener más propiedades para filtrar del lado del cliente
  params.set('status', 'publish');
  params.set('acf', 'true');
  params.set('_fields', 'id,slug,title,excerpt,thumbnail_url,acf');

  let propiedades = await wpFetch(`/propiedades?${params.toString()}`) ?? [];

  // Filtrar del lado del cliente por tipo_operacion
  if (filtros.tipo_operacion) {
    const tipoOperacionBuscado = filtros.tipo_operacion.toLowerCase();
    propiedades = propiedades.filter(prop => {
      const valor = prop.acf?.tipo_operacion 
                 || prop.meta?.tipo_operacion 
                 || prop.tipo_operacion;
      const tipoOperacion = valor?.toString().toLowerCase();
      return tipoOperacion === tipoOperacionBuscado;
    });
  }

  // Filtrar por tipo_propiedad
  if (filtros.tipo_propiedad) {
    const tipoPropiedadBuscado = filtros.tipo_propiedad.toLowerCase();
    propiedades = propiedades.filter(prop => {
      const tipoPropiedad = prop.acf?.tipo_propiedad?.toLowerCase();
      return tipoPropiedad === tipoPropiedadBuscado;
    });
  }

  // Filtrar por destacada
  if (filtros.destacada) {
    propiedades = propiedades.filter(prop => {
      const destacada = prop.acf?.destacada;
      // Incluir si está marcada como destacada O si el campo no existe (propiedades antiguas)
      return destacada === true || destacada === '1' || destacada === 1 || destacada === undefined || destacada === null;
    });
  }

  // Filtrar por precio máximo
  if (filtros.precio_max_uf) {
    propiedades = propiedades.filter(prop => {
      const precio = prop.acf?.precio_uf;
      return precio && Number(precio) <= Number(filtros.precio_max_uf);
    });
  }

  // Aplicar paginación después del filtrado
  const perPage = filtros.per_page ?? 12;
  const page = filtros.page ?? 1;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return propiedades.slice(start, end);
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
