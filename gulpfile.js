var scriptSrc = [
    'static/src/js/libraries/modernizr.min.js',
    'static/src/vendor/jquery/dist/jquery.min.js',
    'static/src/vendor/bootstrap/js/affix.js',
    'static/src/js/vendor/**/*.js'
]
var lessSrc = [
    'static/src/less/style.less',
    'static/src/vendor/font-awesome/less/font-awesome.less'
]

/**********
 ** GULP **
 **********/
var gulp = require('gulp');

/*************
 ** PLUGINS **
 *************/
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('default', ['less', 'jshint', 'scripts', 'imagemin']);

gulp.task('imagemin', function() {
    var imgSrc = 'static/src/img/**/*';
    var imgDst = 'static/dist/img';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

gulp.task('jshint', function() {
    gulp.src('static/src/js/vendor/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})
gulp.task('scripts', function() {
    gulp.src(scriptSrc)
        .pipe(concat('my.js'))
        .pipe(gulpif(argv.build, stripDebug()))
        .pipe(gulpif(argv.build, uglify()))
        .pipe(gulpif(argv.build, rename('my.min.js')))
        .pipe(gulp.dest('static/dist/js/'));
});

gulp.task('less', function() {
    gulp.src(lessSrc)
        .pipe(gulpif(!argv.build, sourcemaps.init()))
        .pipe(less())
        .pipe(autoprefixer({map: true}))
        .pipe(concat('style.css'))
        .pipe(gulpif(!argv.build, sourcemaps.write()))
        .pipe(gulpif(argv.build, cleanCSS()))
        .pipe(gulpif(argv.build, rename('style.min.css')))
        .pipe(gulp.dest('static/dist/css'));
});

gulp.task('watch', function() {
    gulp.watch('static/src/js/vendor/**/*.js', ['jshint', 'scripts']);
    gulp.watch('static/src/less/**/*.less', ['less']);
    gulp.watch('static/src/img/**/*', ['imagemin']);
});
