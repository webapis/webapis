import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
export default {
  input: 'index.js',
  output: [
    {
      dir: 'build',
      format: 'es',
      sourcemap: "inline",
    },
  ],
  plugins: [
    image(),
    postcss({
      extensions: ['.css'],
      plugins: [],
    }),
    resolve(),
    babel(),
  ],
};
