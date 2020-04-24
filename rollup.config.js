require('dotenv').config();
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
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
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: 'h',
            pragmaFrag: 'Fragment',
          },
        ],
      ],
    }),
    production && terser(),
    replace({
			api_url: JSON.stringify(process.env.api_url)
		}),
    serve(`apps/${process.env.appName}/build/`),
  ],
};
