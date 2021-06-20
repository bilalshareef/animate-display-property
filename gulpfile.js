var gulp = require("gulp");
var del = require("del");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var rename = require("gulp-rename");
var browserSync = require("browser-sync").create();

var config = {
    distFolder: "dist"
};

gulp.task("clean", function() {
    del([config.distFolder]);
});

gulp.task("copy-adp-hide", function() {
    return gulp.src([
        "src/adp-hide.css"
    ]).pipe(gulp.dest(config.distFolder));
});

gulp.task("copy-effects", function () {
    return gulp.src([
        "src/effects/**/*"
    ]).pipe(gulp.dest(config.distFolder + "/effects"));
});

gulp.task("copy-js", function() {
    return gulp.src([
        "src/adp.js"
    ]).pipe(gulp.dest(config.distFolder));
});

gulp.task("copy", ["copy-adp-hide", "copy-effects", "copy-js"]);

gulp.task("concat-css", function () {
    return gulp.src([
        "src/effects/*",
        "src/adp-hide.css"
    ]).pipe(concat("adp.css"))
    .pipe(gulp.dest(config.distFolder));
});

gulp.task("minify-effects", function() {
    return gulp.src([
        "src/effects/**/*"
    ]).pipe(uglifycss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(config.distFolder + "/effects"));
});

gulp.task("minify-css", function() {
    return gulp.src([config.distFolder + "/adp.css", config.distFolder + "/adp-hide.css"])
        .pipe(uglifycss())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(config.distFolder));
});

gulp.task("minify-js", function() {
    return gulp.src(config.distFolder + "/adp.js")
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(config.distFolder));
});

gulp.task("minify", ["minify-effects", "minify-css", "minify-js"]);

// Development related scripts
var browserSyncConfig = {
    server: {
        baseDir: "./"
    },
    startPath: "/test/index.html?files=src"
};

gulp.task("browser-sync", function() {
    browserSync.init(browserSyncConfig);
});

gulp.task("reload",function() {
    browserSync.reload();
});

gulp.task("test", ["browser-sync"], function () {
    var filesToWatch = ["src/**/*", "test/index.html"];
    gulp.watch(filesToWatch, ["reload"]);
});

gulp.task("test:dist", function() {
    browserSyncConfig.startPath = "/test/index.html?files=dist";
    browserSync.init(browserSyncConfig);
});
