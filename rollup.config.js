import babel from '@rollup/plugin-babel';

export default {
  input: 'src/extract.v3.js',
  output: {
    file: 'lib/extract.v3.umd.js',
    format: 'umd',
    name: 'jsExtract',
    exports: 'default',
  },
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
};
