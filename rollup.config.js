import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'build/middlemitter.js', format: 'umd', exports: 'named', name: 'middlemitter',
    },
    { file: 'build/middlemitter.es.js', format: 'es', exports: 'named' },
  ],

  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};
