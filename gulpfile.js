import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from "postcss-csso";
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import webP from 'gulp-webp';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync as del} from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//Scripts

const script = () => {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = async () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

//WebP

const createWebP = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(webP())
  .pipe(gulp.dest('build/img'));
}

//SVG

const svg = () => {
  return gulp.src(['source/img/catalog/*.svg', 'source/img/form/*.svg', 'source/img/index/*.svg', 'source/img/favicons/*.svg', '!source/img/icons/*.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('build/img'));
}

//Sprite

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

 const copy = (done) => {
  return gulp.src([
    'source/fonts/lato/*.{woff2,woff}',
    'source/fonts/oswald/*.{woff2,woff}',
    'source/*.ico',
], {
  base: 'source'
})
.pipe(gulp.dest('build'))
done();
}

//Clean

const clean = () => {
  return del('build');
}


// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  })
done();
}

//Reload

const reload = (done) => {
  browser.reload()
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/js/script.js', gulp.series(script));
}

//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    script,
    svg,
    sprite,
    createWebP
  ),
);

//Default

export default gulp.series(
  clean,
   copy,
    copyImages,
    gulp.parallel(
      sprite,
       svg,
        createWebP,
         script,
          html,
           styles),
           gulp.series(
            server,
            watcher)
);
