
const gulp         = require('gulp');
const deploy       = require('gulp-gh-pages');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const clean        = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const pug          = require('gulp-pug');
const cleanCSS     = require('gulp-clean-css');
const rename       = require("gulp-rename");
const sourcemaps   = require('gulp-sourcemaps');


gulp.task('deploy', function () {
    return gulp.src("./build/**/*")
        .pipe(deploy());
});

gulp.task('clean', function () {
    return gulp.src(['build'], {read: false})
        .pipe(clean());
});


gulp.task('pug', function () {
    return gulp.src("assets/*.+(jade|pug)")
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest("build"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('min-css', function() {
    return gulp.src("assets/css/*.css")
        .pipe(rename({suffix: ".min"}))
        .pipe(cleanCSS())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function () {
    return gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function () {
    return gulp.src('assets/img/**/*.*')
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.reload({stream: true}))
});


gulp.task('js', function () {
    return gulp.src('assets/js/**/*.*')
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function () {
    return gulp.src('assets/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .pipe(autoprefixer({
        //     browsers: ['last 1 versions'],
        //     cascade: false
        // }))
        .pipe(rename({suffix: ".min"}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});



gulp.task('html', function () {
    return gulp.src("assets/*.html")
        .pipe(gulp.dest("build"))
        .pipe(browserSync.reload({stream: true}))
});





gulp.task('watch', gulp.series('html', 'pug', 'img', 'js', 'sass', 'fonts', 'min-css',  (done) => {
    // browserSync.init({
    //     proxy: "localhost/resume2019",
    //     port: 8000,
    //     // tunnel: true
    // });

    browserSync.init({
        server: "./build",
        notify: false,
        ui: {
            port: 3000
        },
        // tunnel: true
    });
    gulp.watch('assets/**/*.html', gulp.parallel('html'));
    gulp.watch('assets/**/*.+(jade|pug|html)', gulp.parallel('pug'));
    gulp.watch('assets/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('assets/js/**/*.js', gulp.parallel('js'));
    gulp.watch('assets/css/**/*.css', gulp.parallel('min-css'));
    gulp.watch('assets/img/**/*.*', gulp.parallel('img'));
    gulp.watch('assets/fonts/**/*', gulp.parallel('fonts'));
    done();
}));
