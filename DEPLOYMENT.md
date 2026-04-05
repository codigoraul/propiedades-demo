# Deployment Guide - InmoPremium

## Configuración de Variables de Entorno

### Desarrollo Local

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Actualiza las variables en `.env` con tus credenciales:
```env
WP_API_URL=https://disenopaginas.cl/admin-prop/wp-json/wp/v2
WP_APP_USER=tu_usuario_wordpress
WP_APP_PASS=tu_contraseña_aplicacion_wordpress
PUBLIC_SITE_URL=https://disenopaginas.cl/demo-propiedades
```

### GitHub Secrets

Configura los siguientes secrets en tu repositorio de GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

#### WordPress API Secrets:
- `WP_API_URL`: `https://disenopaginas.cl/admin-prop/wp-json/wp/v2`
- `WP_APP_USER`: Tu usuario de WordPress
- `WP_APP_PASS`: Contraseña de aplicación de WordPress (no tu contraseña normal)
- `PUBLIC_SITE_URL`: `https://disenopaginas.cl/demo-propiedades`

#### SSH Deployment Secrets:
- `SSH_PRIVATE_KEY`: Tu clave privada SSH (contenido completo del archivo `~/.ssh/id_rsa`)
- `REMOTE_HOST`: `disenopaginas.cl` (o la IP de tu servidor)
- `REMOTE_USER`: Usuario SSH del servidor (ej: `root` o `ubuntu`)
- `REMOTE_PORT`: `22` (puerto SSH, por defecto 22)
- `REMOTE_PATH`: Ruta absoluta en el servidor donde se desplegará (ej: `/var/www/demo-propiedades`)

## Cómo Obtener la Contraseña de Aplicación de WordPress

1. Inicia sesión en tu WordPress: `https://disenopaginas.cl/admin-prop/wp-admin`
2. Ve a **Usuarios → Perfil**
3. Baja hasta la sección **Contraseñas de aplicación**
4. Crea una nueva contraseña con el nombre "Astro Headless"
5. Copia la contraseña generada (solo se muestra una vez)
6. Usa esta contraseña en `WP_APP_PASS`

## Deployment Automático

El proyecto se despliega automáticamente cuando:
- Haces push a la rama `main`
- Ejecutas manualmente el workflow desde GitHub Actions

### Proceso de Deployment:

1. **Build**: Compila el proyecto Astro con las variables de entorno
2. **Deploy**: Sube los archivos al servidor vía SSH
3. **Restart**: Reinicia la aplicación con PM2

## Deployment Manual

Si necesitas desplegar manualmente:

```bash
# 1. Build del proyecto
npm run build

# 2. Subir al servidor (ajusta las rutas)
scp -r dist/* usuario@disenopaginas.cl:/var/www/demo-propiedades/

# 3. Conectar al servidor
ssh usuario@disenopaginas.cl

# 4. Reiniciar la aplicación
cd /var/www/demo-propiedades
pm2 restart astro-propiedades
```

## Requisitos del Servidor

- Node.js 18 o superior
- PM2 instalado globalmente: `npm install -g pm2`
- Acceso SSH configurado
- Permisos de escritura en el directorio de deployment

## Estructura de URLs

- **WordPress Admin**: `https://disenopaginas.cl/admin-prop/wp-admin`
- **WordPress API**: `https://disenopaginas.cl/admin-prop/wp-json/wp/v2`
- **Sitio Astro**: `https://disenopaginas.cl/demo-propiedades`

## Troubleshooting

### Error: "Cannot read searchParams"
- Asegúrate de que `output: 'server'` esté en `astro.config.mjs`
- Verifica que el adaptador de Node esté instalado

### Error de CORS
- Verifica que WordPress tenga configurado CORS para permitir peticiones desde tu dominio
- Añade en WordPress (functions.php o plugin):
```php
add_action('rest_api_init', function() {
    header('Access-Control-Allow-Origin: https://disenopaginas.cl');
});
```

### Imágenes no cargan
- Verifica que las URLs de las imágenes en WordPress sean absolutas
- Comprueba que el campo `thumbnail_url` esté configurado en ACF

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Ver logs en el servidor
pm2 logs astro-propiedades

# Reiniciar aplicación
pm2 restart astro-propiedades

# Ver estado de PM2
pm2 status
```
