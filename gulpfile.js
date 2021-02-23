const gulp = require("gulp");
const path = require("path");
const del = require("del");
const cp = require("child_process");
const browserSync = require("browser-sync");
const postcss = require("gulp-postcss");
const postcssNesting = require("postcss-nested");
const postcssImports = require("postcss-easy-import");
const postcssVars = require("postcss-nested-vars");
const postcssRgb = require("postcss-rgb");
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
  const baseurl = "/template";
  browserSync.init({
    baseDir: "_site/",
    ui: false,
    startPath: baseurl,
    server: {
      routes: {
        [baseurl]: "_site/",
      },
    },
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
        postcssVars,
        postcssRgb,
        postcssNesting,
        tailwind,
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
      "./node_modules/jquery/dist/jquery.min.js",
      "./_assets/js/main.js",
    ])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./_site/_assets/js/"))
    .pipe(browserSync.reload({ stream: true }));

// build for additional js files
const buildJs = () =>
  gulp
    .src(["./_assets/js/*.js", "!./_assets/js/main.js"])
    .pipe(gulp.dest("./_site/_assets/js/"))
    .pipe(browserSync.reload({ stream: true }));

/////////////////////////////////////////////////////////////////////////  watch

// Watch files
const watchFiles = () => {
  gulp.watch(["./_assets/css/**/*.css", "./tailwind.config.js"], buildCss);
  gulp.watch("./_assets/font/**/*.*", buildFonts);
  gulp.watch("./_assets/js/**/*.js", gulp.parallel(buildJsMain, buildJs));
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
        defaultExtractor: (content) => {
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches =
            content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        },
      })
    )
    .pipe(
      postcss([
        autoprefixer({
          cascade: false,
        }),
        cssnano(),
      ])
    )
    .pipe(gulp.dest("./_site/_assets/css"));

const compressImages = () =>
  gulp
    .src("./_site/_assets/img/**/*")
    .pipe(
      image({
        svgo: ["--disable", "removeViewBox"],
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
        removeComments: true,
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
    buildJs
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
