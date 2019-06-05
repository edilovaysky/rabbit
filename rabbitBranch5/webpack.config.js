'use strict';

module.exports = {
  entry: './js/js_modules/index.js',
  output: {
    filename: './build.js',
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 100,
  },
};
