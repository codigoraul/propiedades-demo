// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://disenopaginas.cl',
  base: '/propiedades-demo',
  trailingSlash: 'ignore'
});