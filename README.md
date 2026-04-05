# InmoPremium - Sitio Web de Propiedades

Sitio web headless de propiedades inmobiliarias construido con Astro y WordPress como CMS.

## 🏗️ Stack Tecnológico

- **Frontend**: Astro (SSR mode)
- **CMS**: WordPress con ACF (Advanced Custom Fields)
- **API**: WordPress REST API
- **Deployment**: GitHub Actions + SSH
- **Server**: Node.js con PM2

## 🌐 URLs del Proyecto

- **Sitio Web**: https://disenopaginas.cl/propiedades-demo
- **WordPress Admin**: https://disenopaginas.cl/admin-prop/wp-admin
- **WordPress API**: https://disenopaginas.cl/admin-prop/wp-json/wp/v2

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Actualiza las variables en `.env` con tus credenciales de WordPress

### Desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

### Build para Producción

```bash
npm run build
```

### Preview del Build

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/                     # Archivos estáticos
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── Breadcrumb.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   └── PropCard.astro
│   ├── layouts/
│   │   └── Layout.astro       # Layout principal
│   ├── lib/
│   │   └── wp-api.js          # Cliente de WordPress API
│   ├── pages/
│   │   ├── api/               # API endpoints
│   │   ├── propiedades/       # Páginas de propiedades
│   │   ├── busqueda.astro     # Página de búsqueda
│   │   ├── contacto.astro
│   │   ├── index.astro        # Página de inicio
│   │   └── nosotros.astro
│   └── styles/                # Estilos globales
├── .env.example               # Plantilla de variables de entorno
├── astro.config.mjs           # Configuración de Astro
├── DEPLOYMENT.md              # Guía de deployment
└── GITHUB_SETUP.md            # Guía de configuración de GitHub
```

## 🔧 Características

- ✅ Búsqueda de propiedades con filtros (tipo de operación, tipo de propiedad, precio)
- ✅ Páginas dinámicas de propiedades
- ✅ Integración con WordPress REST API
- ✅ Formulario de contacto
- ✅ Galería de imágenes
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Deployment automático con GitHub Actions

## 📚 Documentación

- [Guía de Deployment](./DEPLOYMENT.md) - Instrucciones completas de deployment
- [Configuración de GitHub](./GITHUB_SETUP.md) - Cómo configurar el repositorio y secrets

## 🔑 Variables de Entorno

Ver `.env.example` para la lista completa de variables necesarias.

Variables principales:
- `WP_API_URL` - URL de la API de WordPress
- `WP_APP_USER` - Usuario de WordPress
- `WP_APP_PASS` - Contraseña de aplicación de WordPress
- `PUBLIC_SITE_URL` - URL pública del sitio

## 🚢 Deployment

El proyecto se despliega automáticamente a producción cuando se hace push a la rama `main`.

Para deployment manual, consulta [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📝 Comandos Disponibles

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                             |
| `npm run dev`             | Inicia servidor de desarrollo                    |
| `npm run build`           | Construye el sitio para producción              |
| `npm run preview`         | Preview del build localmente                     |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                    |

## � Troubleshooting

Si encuentras problemas, consulta la sección de Troubleshooting en [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📄 Licencia

Proyecto privado - InmoPremium 2026
