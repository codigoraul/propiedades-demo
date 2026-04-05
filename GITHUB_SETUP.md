# Configuración de GitHub Repository

## Pasos para crear el repositorio y configurar deployment

### 1. Inicializar Git (si no está inicializado)

```bash
cd /Users/raulr/Downloads/PARADOCUMENTOS/paginas\ web2025:26/propiedad-astro
git init
git add .
git commit -m "Initial commit: InmoPremium Astro Headless"
```

### 2. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `inmopremium-astro` (o el que prefieras)
3. Descripción: "Sitio web headless de propiedades con Astro y WordPress"
4. Visibilidad: **Private** (recomendado por seguridad)
5. NO inicialices con README, .gitignore o licencia (ya los tienes)
6. Haz clic en **Create repository**

### 3. Conectar repositorio local con GitHub

```bash
# Reemplaza 'tu-usuario' con tu nombre de usuario de GitHub
git remote add origin https://github.com/tu-usuario/inmopremium-astro.git
git branch -M main
git push -u origin main
```

### 4. Configurar GitHub Secrets

Ve a tu repositorio en GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

Agrega cada uno de estos secrets:

#### WordPress Secrets:
```
Name: WP_API_URL
Value: https://disenopaginas.cl/admin-prop/wp-json/wp/v2
```

```
Name: WP_APP_USER
Value: [tu usuario de WordPress]
```

```
Name: WP_APP_PASS
Value: [contraseña de aplicación de WordPress - ver DEPLOYMENT.md]
```

```
Name: PUBLIC_SITE_URL
Value: https://disenopaginas.cl/demo-propiedades
```

#### SSH Deployment Secrets:
```
Name: SSH_PRIVATE_KEY
Value: [contenido completo de tu clave privada SSH]
```

Para obtener tu clave SSH privada:
```bash
cat ~/.ssh/id_rsa
# Copia TODO el contenido, incluyendo las líneas:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

```
Name: REMOTE_HOST
Value: disenopaginas.cl
```

```
Name: REMOTE_USER
Value: [tu usuario SSH, ej: root, ubuntu, etc]
```

```
Name: REMOTE_PORT
Value: 22
```

```
Name: REMOTE_PATH
Value: /var/www/demo-propiedades
```

### 5. Verificar que el workflow funcione

1. Ve a **Actions** en tu repositorio de GitHub
2. Deberías ver el workflow "Deploy to Production"
3. Si no se ejecutó automáticamente, haz clic en "Run workflow"
4. Monitorea los logs para verificar que todo funcione correctamente

### 6. Configuración del servidor (si aún no está hecha)

Conéctate a tu servidor y prepara el directorio:

```bash
ssh usuario@disenopaginas.cl

# Crear directorio para la aplicación
sudo mkdir -p /var/www/demo-propiedades
sudo chown -R $USER:$USER /var/www/demo-propiedades

# Instalar PM2 si no está instalado
npm install -g pm2

# Configurar PM2 para iniciar al arrancar el servidor
pm2 startup
pm2 save
```

### 7. Primer deployment

Después de configurar todo:

```bash
# Hacer un cambio pequeño para probar
echo "# InmoPremium" >> README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

Ve a GitHub Actions y observa el deployment en tiempo real.

## Comandos útiles de Git

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push a GitHub
git push origin main

# Ver historial
git log --oneline

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Ver ramas
git branch -a
```

## Flujo de trabajo recomendado

1. **Desarrollo local**: Trabaja en tu máquina
2. **Commit**: Guarda cambios con mensajes descriptivos
3. **Push**: Sube a GitHub
4. **Auto-deploy**: GitHub Actions despliega automáticamente
5. **Verificar**: Revisa que todo funcione en producción

## Troubleshooting

### Error: "Permission denied (publickey)"
- Verifica que tu clave SSH esté agregada a GitHub
- Usa HTTPS en lugar de SSH: `git remote set-url origin https://github.com/tu-usuario/repo.git`

### Error: "Failed to deploy"
- Revisa los logs en GitHub Actions
- Verifica que todos los secrets estén configurados correctamente
- Comprueba que el servidor sea accesible vía SSH

### Error: "Build failed"
- Verifica que las variables de entorno estén correctas
- Revisa que no haya errores de sintaxis en el código
- Comprueba los logs de build en GitHub Actions
