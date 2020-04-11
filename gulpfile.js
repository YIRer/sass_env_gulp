'use stict';

// const path = require('path');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const cleanCss = require('gulp-clean-css');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
// const del = require('del');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
// const rename = require('gulp-rename');

const dir = {
  src: './public/src',
  dist: './public/dist',
};

const scssOptions = {
  outputStyle: 'expanded',
  indentType: 'tab',
  indentWidth: 1,
  precision: 6,
  sourceComments: false,
};

const src = {
  js: dir.src + '/**/!(*.spec).js',
  css: dir.src + '/**/*.css',
  scss: dir.src + '/**/!(_.)*(._.).scss',
  html: dir.src + '/**/*.html',
  img: dir.src + '/images/**/*',
};

const dist = {
  js: dir.dist + '/',
  css: dir.dist + '/',
  scss: dir.dist + '/',
  html: dir.dist + '/',
  img: dir.dist + '/images/',
};

const scssCompiler = () =>
  gulp
    .src(src.scss)
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions).on('error', scss.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.scss));

const cssCompiler = () =>
  gulp
    .src(src.css)
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css))
    .pipe(browserSync.stream({ match: `${dist}/**/*.css` }));

const jsCompiler = () =>
  gulp
    .src(src.js)
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(gulp.dest(dist.js));
// .pipe(concat('master.js'))
// .pipe(uglify())
// .pipe(
//   rename({
//     suffix: '-min',
//   })
// )
// .pipe(gulp.dest(dist.js));

const htmlCompress = () => gulp.src(src.html).pipe(gulp.dest(dist.html));
const imageCompress = () =>
  gulp.src(src.img).pipe(imagemin()).pipe(gulp.dest(dist.img));

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: dir.dist,
    },
  });
});

gulp.task(
  'watch',
  gulp.series(async () => {
    const watcher = {
      scss: gulp.watch([src.scss], scssCompiler),
      css: gulp.watch([src.css], cssCompiler),
      js: gulp.watch([src.js], jsCompiler),
      img: gulp.watch([src.img], imageCompress),
      html: gulp.watch([src.html], htmlCompress),
    };

    const notify = function (path) {
      gulpUtil.log(
        'File',
        gulpUtil.colors.yellow(path),
        'was',
        gulpUtil.colors.magenta('changed')
      );
    };
    const notifyWithBrowserSync = (path) => {
      notify(path);
      browserSync.reload();
    };

    for (const key in watcher) {
      switch (key) {
        case 'html':
        case 'img':
        case 'js':
          watcher[key].on('change', notifyWithBrowserSync);
          break;

        default:
          watcher[key].on('change', notify);
          break;
      }
    }
  })
);

gulp.task(
  'default',
  gulp.series(gulp.parallel(['watch']), gulp.parallel(['browser-sync'])),
  () => {
    console.log('gulp-start!');
    0;
  }
);
