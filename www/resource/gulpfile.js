var gulp = require('gulp');
var webpack = require('gulp-webpack');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

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

gulp.task('sass',function(){
  gulp.src('sass/index.scss')
  .pipe(compass({
    css: 'css/',
    sass: 'sass/',
    image: 'img/indexImg/'
  }))
  .pipe(gulp.dest('css/'));
})

gulp.task('cssConcat',['sass'],function(){
  gulp.src(['css/index.css', 'css/animate.css'])
    .pipe(concat('index.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('css/'));
})
