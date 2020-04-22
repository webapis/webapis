require('dotenv').config();
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import del from 'rollup-plugin-delete';
const production = !process.env.ROLLUP_WATCH;

export default {
  input: `client/${process.env.appName}/index.js`,
  output: [
    {
      dir: `apps/${process.env.appName}/build`,
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  plugins: [
    del({ targets: `apps/${process.env.appName}/build/*` }),
    htmlTemplate({
      template: 'config/rollup/html-template/index.html',
      target: `apps/${process.env.appName}/build/index.html`,
      attrs: ['type="module"'],
    }),
    image(),
    postcss({
      extensions: ['.css'],
      plugins: [],
    }),
    resolve(),
    babel(),
    serve(`apps/${process.env.appName}/build/`),
  ],
};
