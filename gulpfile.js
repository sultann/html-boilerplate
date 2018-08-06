var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var config = {
  dist: 'dist/',
  src: './',
  cssin: 'assets/css/**/*.css',
  jsin: 'assets/js/src/',
  imgin: 'assets/images/src/**/*.{jpg,jpeg,png,gif}',
  htmlin: '*.html',
  scssin: 'assets/scss/**/*.scss',
  cssout: 'assets/css/',
  jsout: 'assets/js/',
  imgout: 'assets/images/',
  htmlout: 'dist/',
  scssout: 'assets/css/',
  cssoutname: 'style.css',
  jsoutname: 'script.js',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: config.src
  });

  gulp.watch([config.htmlin, config.jsin], ['reload']);
  gulp.watch('./assets/css/scss/**/**.scss', ['sass']);
});

gulp.task('sass', function() {
  return gulp.src('./assets/css/scss/**/**.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src('./assets/js/src/**/**.js')
    .pipe(concat(config.jsoutname))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(htmlReplace({
      'css': config.cssreplaceout,
      'js': config.jsreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function() {
  return del([config.dist]);
});

gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css', 'img']);
});

gulp.task('default', ['serve']);