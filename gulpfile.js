var gulp = require('gulp'),
    preprocess = require('gulp-preprocess'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    svgmin = require('gulp-svgmin'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    shell = require('gulp-shell'),
    argv = require('yargs').argv

gulp.task('default', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: "./src"
    },
    open: false,
    notify: false,
    inject: true
  })
  return gulp.src('')
    .pipe(shell([
      'npm run dev'
    ]))
})

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(minify())
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(browserSync.stream())
})

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch('./sass/**/*.scss', ['sass'])
})

gulp.task('preprocess', ['svg'], function() {
  return gulp.src('./layout/*.html')
    .pipe(preprocess({context: { NODE_ENV: argv.production ? 'production' : 'development'}}))
    .pipe(gulp.dest('./src/'))
})

gulp.task('preprocess:watch', ['preprocess'], function() {
  gulp.watch('./src/*.html', ['preprocess'])
})

gulp.task('svg', function () {
  return gulp.src('./src/assets/svg/*.svg')
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative))
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
      }]
    }
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({inlineSvg: true}))
  .pipe(gulp.dest('./src/assets/svg'))
})

// Imgur tasks
var request = require('request'),
    imgurCredentials = require('./credentials-imgur.js')

gulp.task('imgur:create', function () {
  return request({
    url: "https://api.imgur.com/3/album/",
    method: 'post',
    headers: {
      'Authorization': 'Client-ID ' + imgurCredentials.clientId
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body)
      console.log("Album ID: " + data.data.id)
      console.log("Album deletehash: " + data.data.deletehash)
    }
  })
})