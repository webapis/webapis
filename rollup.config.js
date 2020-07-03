
require('dotenv').config();
const path = require('path')
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
import alias from 'rollup-plugin-alias';
const production = !process.env.ROLLUP_WATCH;
const commonPlugins = [
  alias({
    entries: [
      { find: 'controls', replacement: path.resolve(__dirname + '/client/components/controls') },
      { find: 'features', replacement: path.resolve(__dirname + '/client/features') },
      { find: 'components', replacement: path.resolve(__dirname + '/client/components') },
      { find: 'icons', replacement: path.resolve(__dirname + '/client/components/icons') },
      { find: 'server', replacement: path.resolve(__dirname + '/server') }
    ]
  }),
  image(),
 

  postcss({
    extensions: ['.css','.scss'],
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
    PREACT_APP_BACK: process.env.PREACT_APP_BACK ? `${JSON.stringify(process.env.PREACT_APP_BACK)}` : 'PREACT_APP_PARSE',
  }),
  replace({
    ip: JSON.stringify(process.env.ip),
  }),

];

export default [
  {
    input: `client/apps/${process.env.appName}/index.js`,
    output: [
      {
        dir: `builds/${process.env.appName}/build`,
        format: 'es',
        sourcemap: 'inline',
      },
    ],
    plugins: [
      del({ targets: `builds/${process.env.appName}/build/*` }),
      ...commonPlugins,
      copy({
        targets: [{ src: 'assets/libs/parse.min.js', dest: `builds/${process.env.appName}/build` },
        { src: 'assets/fonts/Roboto/Roboto-Regular.ttf', dest: `builds/${process.env.appName}/build` },
        { src: 'assets/manifest/**', dest: `builds/${process.env.appName}/build` }
        ]
      }),
      htmlTemplate({
        template: 'config/rollup/html-template/index.html',
        target: `builds/${process.env.appName}/build/index.html`,
        attrs: ['type="module"'],
      }),
      serve({
        contentBase: `builds/${process.env.appName}/build/`,
        openPage: '/index.html',
        port: 10001,
        open: false,
      }),
    ],
  },
  {
    input: `client/features/authentication/change-password/change-password.js`,
    output: [
      {
        dir: `builds/${process.env.appName}/build`,
        format: 'es',
        sourcemap: 'inline',
      },
    ],
    plugins: [
      ...commonPlugins,
      copy({
        targets: [{ src: 'assets/libs/parse.min.js', dest: `builds/${process.env.appName}/build` },
        { src: 'assets/fonts/Roboto/Roboto-Regular.ttf', dest: `builds/${process.env.appName}/build` },
        { src: 'assets/manifest/**', dest: `builds/${process.env.appName}/build` }
        ]
      }),
      htmlTemplate({
        template: 'config/rollup/html-template/changepassword.html',
        target: `builds/${process.env.appName}/build/changepassword.html`,
        attrs: ['type="module"'],
      }),
      serve({
        contentBase: `builds/${process.env.appName}/build/`,
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
      copy({
        targets: [{ src: 'assets/libs/parse.min.js', dest: `client/storybook/build` },
        { src: 'assets/fonts/Roboto/Roboto-Regular.ttf', dest: `client/storybook/build` },
        { src: 'assets/manifest/**', dest: `client/storybook/build` }
        ]
      }),
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

