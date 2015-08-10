var gulp = require('gulp');
var webpack = require('gulp-webpack');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task('default', function() {
  gulp.src('module/order_module/order.js')
    .pipe(webpack())
    .pipe(rename('order.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));

  gulp.src('module/product_module/product.js')
    .pipe(webpack())
    .pipe(rename('product.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
  gulp.src('module/express_module/express.js')
    .pipe(webpack())
    .pipe(rename('express.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
  gulp.src('module/users_module/users.js')
    .pipe(webpack())
    .pipe(rename('users.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});
