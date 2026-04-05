<?php
/**
 * Agregar columnas personalizadas al listado de Propiedades en WordPress Admin
 * 
 * INSTRUCCIONES:
 * 1. Copia este código en el archivo functions.php de tu tema activo
 * 2. O créalo como un plugin simple en wp-content/plugins/propiedades-admin-columns/
 */

// Agregar columnas personalizadas al listado de propiedades
add_filter('manage_propiedades_posts_columns', 'agregar_columnas_propiedades');
function agregar_columnas_propiedades($columns) {
    // Crear nuevo array de columnas en el orden deseado
    $new_columns = array();
    
    // Checkbox
    $new_columns['cb'] = $columns['cb'];
    
    // Título
    $new_columns['title'] = $columns['title'];
    
    // NUEVA: Tipo de Operación
    $new_columns['tipo_operacion'] = '<span class="dashicons dashicons-tag" style="color:#2271b1"></span> Operación';
    
    // NUEVA: Tipo de Propiedad
    $new_columns['tipo_propiedad'] = '<span class="dashicons dashicons-admin-home"></span> Tipo';
    
    // NUEVA: Precio
    $new_columns['precio'] = '<span class="dashicons dashicons-money-alt" style="color:#00a32a"></span> Precio UF';
    
    // NUEVA: Ciudad
    $new_columns['ciudad'] = '<span class="dashicons dashicons-location"></span> Ciudad';
    
    // NUEVA: Destacada
    $new_columns['destacada'] = '<span class="dashicons dashicons-star-filled" style="color:#f0b849"></span> Destacada';
    
    // Fecha
    $new_columns['date'] = $columns['date'];
    
    return $new_columns;
}

// Rellenar las columnas con datos
add_action('manage_propiedades_posts_custom_column', 'rellenar_columnas_propiedades', 10, 2);
function rellenar_columnas_propiedades($column, $post_id) {
    switch ($column) {
        case 'tipo_operacion':
            $tipo = get_field('tipo_operacion', $post_id);
            if ($tipo) {
                $labels = array(
                    'venta' => '<span style="background:#2271b1;color:#fff;padding:3px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase;">Venta</span>',
                    'arriendo' => '<span style="background:#00a32a;color:#fff;padding:3px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase;">Arriendo</span>',
                    'arriendo_temp' => '<span style="background:#f0b849;color:#fff;padding:3px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase;">Arriendo Temporal</span>'
                );
                echo $labels[$tipo] ?? $tipo;
            } else {
                echo '<span style="color:#999">—</span>';
            }
            break;
            
        case 'tipo_propiedad':
            $tipo = get_field('tipo_propiedad', $post_id);
            if ($tipo) {
                $labels = array(
                    'casa' => 'Casa',
                    'departamento' => 'Departamento',
                    'terreno' => 'Terreno',
                    'oficina' => 'Oficina',
                    'local_comercial' => 'Local Comercial',
                    'parcela' => 'Parcela'
                );
                echo $labels[$tipo] ?? ucfirst($tipo);
            } else {
                echo '<span style="color:#999">—</span>';
            }
            break;
            
        case 'precio':
            $precio = get_field('precio_uf', $post_id);
            if ($precio) {
                echo '<strong style="color:#00a32a">' . number_format($precio, 0, ',', '.') . ' UF</strong>';
            } else {
                echo '<span style="color:#999">—</span>';
            }
            break;
            
        case 'ciudad':
            $ciudad = get_field('ciudad', $post_id);
            $sector = get_field('sector', $post_id);
            if ($ciudad) {
                echo '<strong>' . esc_html($ciudad) . '</strong>';
                if ($sector) {
                    echo '<br><small style="color:#666">' . esc_html($sector) . '</small>';
                }
            } else {
                echo '<span style="color:#999">—</span>';
            }
            break;
            
        case 'destacada':
            $destacada = get_field('destacada', $post_id);
            if ($destacada) {
                echo '<span class="dashicons dashicons-star-filled" style="color:#f0b849;font-size:20px"></span>';
            } else {
                echo '<span style="color:#ddd">—</span>';
            }
            break;
    }
}

// Hacer las columnas ordenables
add_filter('manage_edit-propiedades_sortable_columns', 'columnas_ordenables_propiedades');
function columnas_ordenables_propiedades($columns) {
    $columns['precio'] = 'precio_uf';
    $columns['ciudad'] = 'ciudad';
    return $columns;
}

// Configurar el ordenamiento
add_action('pre_get_posts', 'ordenar_propiedades_admin');
function ordenar_propiedades_admin($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }
    
    if ($query->get('post_type') !== 'propiedades') {
        return;
    }
    
    $orderby = $query->get('orderby');
    
    if ('precio_uf' === $orderby) {
        $query->set('meta_key', 'precio_uf');
        $query->set('orderby', 'meta_value_num');
    }
    
    if ('ciudad' === $orderby) {
        $query->set('meta_key', 'ciudad');
        $query->set('orderby', 'meta_value');
    }
}
