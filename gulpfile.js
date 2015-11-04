var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
});
// 编译项目scss文件
gulp.task('scss2css',function(){
    return sass('www/resource/sass/index.scss',{
        sourcemap:true,
        style:'compressed',
        compass:true
    })
        .on('error',sass.logError)
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('maps',{
            includeContent:false,
            sourceRoot:'www/resource/css'
        }))
        .pipe(gulp.dest('www/resource/css/'));
});
//合并css文件
gulp.task('concat', function() {
    return gulp.src(['www/resource/css/index.css', 'www/resource/css/animate.css'])
        .pipe(concat('index.min.css'))
        .pipe(gulp.dest('www/resource/css/'));
});
// 监听scss文件
gulp.task('watchScss', function () {
    gulp.watch('www/resource/sass/*.scss', ['scss2css','concat']);
});