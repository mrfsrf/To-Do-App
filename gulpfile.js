const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

function style() {
    return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('scss/'))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 8080
    });

    gulp.watch('scss/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('js/*.js', style).on('change', browserSync.reload);
}
exports.style = style;
exports.watch = watch;

