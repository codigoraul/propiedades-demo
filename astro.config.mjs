// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  site: 'https://disenopaginas.cl',
  base: '/propiedades-demo',
  trailingSlash: 'ignore'
});