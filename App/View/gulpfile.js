var gulp = require('gulp');
var webpack = require('gulp-webpack');
var rename = require("gulp-rename");
var vue = require('vue-loader')

gulp.task('default', function() {
  gulp.src('components/index.js')

  .pipe(webpack({
    module: {
      loaders: [
        { test: /\.vue$/, loader: 'vue-loader'}
      ]
    }
  }))
  .pipe(rename('index.js'))
  .pipe(gulp.dest('dist/'));
});
