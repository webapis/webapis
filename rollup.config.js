
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
import copy from 'rollup-plugin-copy';
const production = !process.env.ROLLUP_WATCH;
const commonPlugins = [
  image(),
  copy({targets:[{src:'assets/libs/parse.min.js',dest:`apps/${process.env.appName}/build`},
  {src:'assets/fonts/Roboto/Roboto-Regular.ttf',dest:`apps/${process.env.appName}/build`},
  {src:'assets/manifest/**',dest:`apps/${process.env.appName}/build`}
]}),
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
    PREACT_APP_BACK: process.env.PREACT_APP_BACK ? `${JSON.stringify(process.env.PREACT_APP_BACK)}`:'PREACT_APP_PARSE',
  }),
  replace({
    ip: JSON.stringify(process.env.ip),
  }),
 
];

export default [
  {
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
      ...commonPlugins,
      htmlTemplate({
        template: 'config/rollup/html-template/index.html',
        target: `apps/${process.env.appName}/build/index.html`,
        attrs: ['type="module"'],
      }),
      serve({
        contentBase: `apps/${process.env.appName}/build/`,
        openPage: '/index.html',
        port: 10001,
        open: false,
      }),
    ],
  },
  {
    input: `client/auth/change-password/change-password.js`,
    output: [
      {
        dir: `apps/${process.env.appName}/build`,
        format: 'es',
        sourcemap: 'inline',
      },
    ],
    plugins: [
      ...commonPlugins,
      htmlTemplate({
        template: 'config/rollup/html-template/changepassword.html',
        target: `apps/${process.env.appName}/build/changepassword.html`,
        attrs: ['type="module"'],
      }),
      serve({
        contentBase: `apps/${process.env.appName}/build/`,
        openPage: '/changepassword.html',
        port: 10002,
        open: false,
      }),
    ],
  },

  {
    input: `client/storybook/index.js`,
    output: [
      {
        dir: `client/storybook/build`,
        format: 'es',
        sourcemap: 'inline',
      },
    ],
    plugins: [
      del({ targets: `client/storybook/build/*` }),
      ...commonPlugins,
      htmlTemplate({
        template: 'config/rollup/html-template/index.html',
        target: `client/storybook/build/index.html`,
        attrs: ['type="module"']
      }),
      serve({
        contentBase: `client/storybook/build/`,
        openPage: '/index.html',
        port: 10004,
        open: true,
      }),
    ],
  },
];

