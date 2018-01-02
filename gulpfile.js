"use stict";
const   gulp = require('gulp'),
        gulpUtil = require('gulp-util'),
        autoprefixer = require('gulp-autoprefixer'),
        babel = require('gulp-babel'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        cleanCss = require('gulp-clean-css'),
        scss = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        del = require('del');

const dir = {
    src: "./public/src",
    dist: "./public/dist"
}

const scssOptions = {
    outputStyle : "expanded",
    indentType : "tab", 
    indentWidth : 1,
    precision: 6,
    sourceComments: false };

// const reg = new RegExp();   
const src = {
    js: dir.src + "/**/!(*.spec).js",
    css: dir.src + "/**/*.css",
    scss: dir.src + "/**/!(_.)*(._.).scss",
    html: dir.src + "/**/*.html",
    img: dir.src + "/images/**/*",
};

const dist = {
    js: dir.dist + "/",
    css: dir.dist + "/",
    scss: dir.dist + "/",
    html: dir.dist + "/",
    img: dir.dist + "/",
};


gulp.task('default',['watch'], () => {
    console.log("gulp-start!");
});

gulp.task('scss', () => {
    return gulp.src(src.scss)
               .pipe(sourcemaps.init())
               .pipe(scss(scssOptions).on('error', scss.logError))
            //    .pipe(autoprefixer())
            //    .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest('./public/src'))
});
gulp.task('watch',function(){
    var watcher = {
          scss : gulp.watch(src.scss, ['scss'])
      };
  
      var notify = function(event){
        gulpUtil.log('File', gulpUtil.colors.yellow(event.path), 'was', gulpUtil.colors.magenta(event.type));
      };
  
      for(var key in watcher) {
          watcher[key].on('change', notify);
      }
});