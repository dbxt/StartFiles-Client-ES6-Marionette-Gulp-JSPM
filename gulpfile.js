"use strict";
var gulp        = require("gulp");
var browserSync = require("browser-sync").create();
var jshint      = require("gulp-jshint");
var stylish     = require("jshint-stylish");
//var debug       = require("gulp-debug");

gulp.task("js", function () {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulp.dest("dist"));
});

gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("src/*.js").on("change", browserSync.reload);
});

gulp.task("default", ["serve"]);