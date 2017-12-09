var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');

var config = {
    buildFolder: 'build',
};

gulp.task('clean', function() {
    del([config.buildFolder + '/*']);
});

gulp.task('copy', function() {
    return gulp.src([
        'src/**/*'
    ]).pipe(gulp.dest(config.buildFolder));
});

gulp.task('minify-js', ['copy'], function() {
    return gulp.src(config.buildFolder + '/adp.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('minify-css', ['minify-js'], function() {
    return gulp.src(config.buildFolder + '/adp.css')
        .pipe(uglifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('build', ['minify-css']);