# Instrucciones para WordPress

## Agregar columnas personalizadas al admin de Propiedades

Para que en el listado de propiedades de WordPress aparezca el tipo de operación (Venta/Arriendo), tipo de propiedad, precio, ciudad y si está destacada, sigue estos pasos:

### Opción 1: Agregar al functions.php del tema (Recomendado)

1. Ve a **Apariencia → Editor de archivos del tema** en WordPress
2. Abre el archivo `functions.php`
3. Copia TODO el contenido del archivo `wordpress-admin-columns.php` (que está en la raíz de este proyecto)
4. Pégalo al final del archivo `functions.php`
5. Guarda los cambios

### Opción 2: Crear un plugin simple

1. Crea una carpeta en `wp-content/plugins/` llamada `propiedades-admin-columns`
2. Dentro de esa carpeta, crea un archivo `propiedades-admin-columns.php`
3. Agrega este encabezado al inicio del archivo:

```php
<?php
/**
 * Plugin Name: Propiedades - Columnas Admin
 * Description: Agrega columnas personalizadas al listado de propiedades en el admin
 * Version: 1.0
 * Author: Tu Nombre
 */
```

4. Luego pega el contenido del archivo `wordpress-admin-columns.php`
5. Ve a **Plugins** en WordPress y activa el plugin

## Resultado

Después de aplicar estos cambios, en el listado de propiedades verás:

- ✅ **Operación**: Badge de color (Venta en azul, Arriendo en verde, Arriendo Temporal en amarillo)
- ✅ **Tipo**: Casa, Departamento, Terreno, etc.
- ✅ **Precio UF**: Precio formateado con separadores de miles
- ✅ **Ciudad**: Ciudad y sector (si existe)
- ✅ **Destacada**: Estrella dorada si está marcada como destacada
- ✅ Las columnas de Precio y Ciudad son ordenables (puedes hacer clic en el encabezado)

## Filtrado en las páginas de Astro

El filtrado por tipo de operación (venta/arriendo) ya está funcionando correctamente en:
- `/propiedades/venta`
- `/propiedades/arriendo`

Los filtros ahora funcionan del lado del cliente, filtrando correctamente por los campos ACF.
