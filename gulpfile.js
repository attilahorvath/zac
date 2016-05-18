'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('clean', () => {
  return del(['compiled', 'dist']);
});

gulp.task('compile', ['clean', 'lint'], () => {
  return gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('compiled'));
});

gulp.task('browserify', ['compile'], () => {
  return browserify('compiled/zac.js')
  .transform('browserify-shader')
  .bundle()
  .pipe(source('zac.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js', 'shaders/**/*'], ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);
