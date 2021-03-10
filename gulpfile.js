const gulp = require("gulp");
const path = require("path");
const del = require("del");
const cp = require("child_process");
const browserSync = require("browser-sync");
const postcss = require("gulp-postcss");
const postcssNesting = require("postcss-nested");
const postcssImports = require("postcss-easy-import");
const postcssVars = require("postcss-simple-vars");
const postcssNestedVars = require("postcss-nested-vars");
const postcssRgb = require("postcss-rgb");
const postcssMixins = require("postcss-sassy-mixins");
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("gulp-purgecss");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const image = require("gulp-image");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");

/////////////////////////////////////////////////////////////////////  utilities

// starts with fresh asset files - workaround as not using jekyll's sass engine
const cleanAssets = () => del(["./_site/_assets/**/*"]);

// start browserSync local server - show under site subdirectory
const browserSyncServe = () => {
  const baseurl = "/uk/2021/road-trip-escapes";
  browserSync.init({
    baseDir: "_site/",
    ui: false,
    startPath: baseurl,
    server: {
      routes: {
        [baseurl]: "_site/"
      }
    }
  });
};

// reload BrowserSync for changes
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

/////////////////////////////////////////////////////////////////////////  build

// build the jekyll site
const buildJekyll = (done) =>
  cp.spawn("jekyll", ["build"], { stdio: "inherit" }).on("close", done);

// build css
const buildCss = () =>
  gulp
    .src("./_assets/css/*.css")
    .pipe(
      postcss([
        postcssImports,
        postcssMixins,
        postcssVars,
        postcssNestedVars,
        postcssRgb,
        postcssNesting,
        tailwind
      ])
    )
    .pipe(gulp.dest("./_site/_assets/css/"))
    .pipe(browserSync.reload({ stream: true }));

// build for font files
const buildFonts = () =>
  gulp.src("./_assets/font/**/*.*").pipe(gulp.dest("./_site/_assets/font/"));

// build for image files
const buildImages = () =>
  gulp.src("./_assets/img/**/*.*").pipe(gulp.dest("./_site/_assets/img/"));

// build for main js file
const buildJsMain = () =>
  gulp
    .src([
      //  JS MAIN FILE BUILD
      // --------------------
      // plugins
      "./node_modules/jquery/dist/jquery.min.js",
      // "./node_modules/waypoints/lib/jquery.waypoints.min.js",
      // start custom js - wraps all code with on doc ready
      "./_assets/js/_component/on-ready/start.js",
      // components
      "./_assets/js/_component/standard.js",
      "./_assets/js/_component/offers.js",
      // custom js for project
      "./_assets/js/main.js",
      // end custom js - wraps all code with on doc ready
      "./_assets/js/_component/on-ready/end.js"
    ])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./_site/_assets/js/"))
    .pipe(browserSync.reload({ stream: true }));

// build for js file on overview page
const buildJsOverview = () =>
  gulp
    .src([
      "./_assets/js/_component/on-ready/start.js",
      "./_assets/js/map-data/trip/*.js",
      "./_assets/js/page/overview.js",
      "./_assets/js/_component/on-ready/end.js"
    ])
    .pipe(concat("overview.js"))
    .pipe(gulp.dest("./_site/_assets/js/"))
    .pipe(browserSync.reload({ stream: true }));

// build for js file on each road trip page
const buildJsTrip = () =>
  gulp
    .src([
      "./node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js",
      // "./node_modules/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js",
      "./_assets/js/_component/on-ready/start.js",
      "./_assets/js/map-data/trip/*.js",
      "./_assets/js/_component/debounce.js",
      "./_assets/js/page/trip.js",
      "./_assets/js/_component/on-ready/end.js"
    ])
    .pipe(concat("trip.js"))
    .pipe(gulp.dest("./_site/_assets/js/"))
    .pipe(browserSync.reload({ stream: true }));

// // build for additional js files
// const buildJs = () =>
//   gulp
//     .src(["./_assets/js/*.js", "!./_assets/js/main.js"])
//     .pipe(gulp.dest("./_site/_assets/js/"))
//     .pipe(browserSync.reload({ stream: true }));

/////////////////////////////////////////////////////////////////////////  watch

// Watch files
const watchFiles = () => {
  gulp.watch(["./_assets/css/**/*.css", "./tailwind.config.js"], buildCss);
  gulp.watch("./_assets/font/**/*.*", buildFonts);
  gulp.watch(
    "./_assets/js/**/*.js",
    gulp.parallel(buildJsMain, buildJsOverview, buildJsTrip)
  );
  gulp
    .watch("./_assets/img/**/*.*", buildImages)
    // updates the compiled folder if an image is deleted
    // modified snippet from https://gulpjs.org/recipes/handling-the-delete-event-on-watch
    .on("change", (event) => {
      if (event.type === "deleted") {
        var filePathFromSrc = path.relative(
          path.resolve("_assets/img/**/*.*"),
          event.path
        );
        var destFilePath = path.resolve(
          "_site/_assets/img/**/*.*",
          filePathFromSrc
        );
        del.sync(destFilePath);
      }
      browserSync.reload();
    });
  // watch for jekyll rebuild
  gulp.watch(
    ["./_data", "./_includes", "./_layouts", "./_pages", "./_config.yml"],
    gulp.series(rebuild)
  );
};

//////////////////////////////////////////////////////////////////////  compress

const compressCss = () =>
  gulp
    .src("./_site/_assets/css/*.css")
    .pipe(
      purgecss({
        content: ["./_site/**/*.{html,js}"],
        safelist: { standard: [/^mapboxgl/] },
        defaultExtractor: (content) => {
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches =
            content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        }
      })
    )
    .pipe(
      postcss([
        autoprefixer({
          cascade: false
        }),
        cssnano()
      ])
    )
    .pipe(gulp.dest("./_site/_assets/css"));

const compressImages = () =>
  gulp
    .src("./_site/_assets/img/**/*")
    .pipe(
      image({
        svgo: ["--disable", "removeViewBox"]
      })
    )
    .pipe(gulp.dest("./_site/_assets/img"));

const compressJs = () =>
  gulp
    .src("./_site/_assets/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./_site/_assets/js"));

const compressHtml = () =>
  gulp
    .src("./_site/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("./_site"));

///////////////////////////////////////////////////////////////////  build tasks

// define complex tasks
const rebuild = gulp.series(buildJekyll, browserSyncReload);
const serve = gulp.series(browserSyncServe);
const watch = gulp.series(watchFiles);
const build = gulp.series(
  cleanAssets,
  gulp.parallel(
    buildJekyll,
    buildCss,
    buildFonts,
    buildImages,
    buildJsMain,
    buildJsOverview,
    buildJsTrip
  )
);
const compress = gulp.parallel(
  compressJs,
  compressHtml,
  compressCss,
  compressImages
);

// build and watch site for development
exports.default = gulp.series(build, gulp.parallel(serve, watch));

// compress & complie the site for uploading to live server
exports.compile = gulp.series(build, compress);
