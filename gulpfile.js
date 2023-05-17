import pkg from 'gulp';
const { src, dest, watch, parallel, series } = pkg;
import mainSass from 'sass'
import gulpSass from 'gulp-sass'
import sourceMap from 'gulp-sourcemaps';
const sass = gulpSass(mainSass)
import concat  from "gulp-concat";
import sync  from "browser-sync";
const browserSync = sync.create();
import uglify  from "gulp-uglify-es";
const ugDefault = uglify.default;
import autoprefixer  from "gulp-autoprefixer";
import imagemin, {mozjpeg, optipng, svgo}  from "gulp-imagemin";
import webpImages  from 'gulp-webp';
import svgSprite  from 'gulp-svg-sprite';
import { deleteAsync } from 'del';
import ttf2woff2  from "gulp-ttf2woff2";
import ttf2woff  from "gulp-ttf2woff";

const librariesPath = [
  "node_modules/swiper/swiper-bundle.min.js",
  ];

const librariesPathCss = [
    "node_modules/swiper/swiper-bundle.min.css",
  ];

function woff2() {
  return src(["app/fonts/src/*.ttf"])
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts/dist"));
}
function woff() {
  return src(["app/fonts/src/*.ttf"])
    .pipe(ttf2woff())
    .pipe(dest("app/fonts/dist"));
}


function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    cors: true,
    browser: "firefox",
    notify: false,
    ui: false,
  });
}

const clear = () => deleteAsync('dist');

function transformImages() {
  return src("app/img/*.{png,jpg,jpeg}")
    .pipe(
      imagemin([
        mozjpeg({ quality: 75, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("app/img"));
}

function sprite() {
  const config = {
    shape: {
      id: {
        separator: '__'
      },
      dimension: {
        maxWidth: 64,
        maxHeight: 64
      },
    },
    mode: {
      symbol: {
        dest : '.',
        sprite: 'sprite.svg'
      }
    }
  };
  
  return src('app/for_sprite/*.svg')
  .pipe(svgSprite(config))
  .pipe(dest('app/img/'));
}

function webp() {
  return src('app/img/*.{png,jpg,jpeg}')
  .pipe(webpImages())
  .pipe(dest('app/img/webp'))
}


function scripts() {
  return src(["app/js/src/*.js"])
    .pipe(concat("main.min.js"))
    .pipe(ugDefault())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function js_libraries() {
  if(!librariesPath) {
    return 
  }
  return src(librariesPath)
  .pipe(concat('libraries.min.js'))
  .pipe(dest("app/js")) 
  .pipe(browserSync.stream());
}

function styles() {
  return src(["app/scss/style.scss"])
    .pipe(sourceMap.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(sourceMap.write())
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function librariesCSS() {
  return src(librariesPathCss)
    .pipe(concat("libraries.min.css"))
    .pipe(dest('app/css/libraries/'));
};

// Сборка в отдельный проект
function build() {
  return src(
    [
      "app/css/**/*.css",
      "app/fonts/**/*",
      "app/img/**/*",
      "app/js/*.js",
      "app/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/src/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

// // gulp styles - Преобразовать *.scss в .css и сохранить в app/css
const allStyles = styles;
// // gulp watching - Следить за изменениями в проекте
const allWatching = watching;
// gulp browsersync - Запустить browsersync в live режиме
const browserReboot = browsersync;
// gulp scripts - Следить за изменениями в скриптах JS
const allScripts = scripts;
const libraries = js_libraries;
const librariesCss = librariesCSS;
// gulp images - Сжатие изображений и сохранение в /dist/images
export const OptImages = transformImages;
export const toDoSprite = sprite;
export const toDoWebp = webp;
 export const processImg = parallel(OptImages, toDoSprite, toDoWebp);
// gulp del - Удалить папку /dist
const clean = clear;

const convertWoff = woff;
const convertWoff2 = woff2;

// gulp - Запуск всех команд
export const dev = parallel(allStyles, allScripts,libraries,librariesCss, browserReboot, allWatching, toDoSprite);

// gulp build - Удаление и перезапись содержимого папки /dist
export const createBuild = series(clean,processImg, build);
// gulp fonts
export  const convertFonts = parallel(convertWoff, convertWoff2);

