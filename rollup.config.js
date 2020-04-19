import resolve from '@rollup/plugin-node-resolve';
import babel from "rollup-plugin-babel";
export default {
  input: 'index.js',
  output: [
    {
      dir: 'build',
      format: 'es',
    },
  ],
  plugins: [resolve(),babel()],
};
