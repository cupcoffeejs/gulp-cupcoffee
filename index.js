var gulp = require('gulp');
var watch = require('gulp-watch');
var stylus = require('gulp-stylus');
var less = require('gulp-less');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var pug = require('gulp-pug');
var autowatch = require('gulp-autowatch');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge')
var path = require('path')
var pathExists = require('path-exists')

module.exports = function(paths = {}) {
    var watch = {},
        watchTask = []

    var pathsJsBefore = [
        path.resolve(__dirname, '..', 'vue/dist/vue.min.js'),
        path.resolve(__dirname, '..',  'jquery/dist/jquery.min.js'),
        path.resolve(__dirname, '..', 'cupcoffee-client/src/cupcoffee.js')
    ]

    var pathsJsAfter = [
        './app/libs/*.js',
        './app/services/*.js',
        './app/controllers/*.js',
        './app/config/*.js',
        './app/app.js'
    ]

    if (paths && paths.js && paths.js.input) {
        if (paths.js.input instanceof Array) {
            paths.js.input = pathsJsBefore.concat(paths.js.input).concat(pathsJsAfter);
        } else {
            paths.js.input = pathsJsBefore.concat([paths.js.input]).concat(pathsJsAfter)
        }
    } else {
        paths.js = {
            input: (paths.js !== false && pathExists.sync('./assets/js')) ? pathsJsBefore.concat(['./assets/js/*.js']).concat(pathsJsAfter) : pathsJsBefore.concat(pathsJsAfter)
        }
    }

    var output = (name) => {
        if (paths[name].output) {
            return paths[name].output;
        } else {
            return path.resolve(paths.output || './public', name)
        }
    }

    var active = (item) => {
        if (!paths[item]) {
            if (pathExists.sync('./assets/' + item) && paths[item] !== false) {
                paths[item] = {
                    'input': './assets/' + item + '/*'
                }
                return true;
            }
            return false;
        }

        return true;
    }


    if (active('fonts')) {
        watch.fonts = './assets/fonts/**/*';
        watchTask.push('fonts')

        gulp.task('fonts', function() {
            gulp.src(paths.fonts.input)
                .pipe(gulp.dest(output('fonts')))
        });
    }

    if (active('images')) {
        watch.images = './assets/images/**/*';
        watchTask.push('images')

        gulp.task('images', function() {
            gulp.src(paths.images.input)
                .pipe(gulp.dest(output('images')))
        });
    }

    if (active('less')) {
        watch.stylus = './assets/less/**/*';
        watchTask.push('less');

        gulp.task('less', function() {
            gulp.src(paths.less.input)
                .pipe(plumber())
                .pipe(less({
                    paths: [path.join(__dirname, 'less', 'includes')]
                }))
                .pipe(gulp.dest(output('less')));
        });
    }

    if (active('stylus')) {
        watch.stylus = './assets/stylus/**/*';
        watchTask.push('stylus');

        gulp.task('stylus', function() {
            gulp.src(paths.stylus.input)
                .pipe(plumber())
                .pipe(stylus({
                    'include css': true
                }))
                .pipe(cleanCSS())
                .pipe(gulp.dest(output('stylus')))
                .pipe(livereload());
        });
    }

    if (active('css')) {
        watch.styles = './assets/css/**/*';
        watchTask.push('css')

        gulp.task('css', function() {
            gulp.src(paths.css.input)
                .pipe(cleanCSS())
                .pipe(concat('styles.css'))
                .pipe(gulp.dest(output('css')))
        });

    }

    if (active('js')) {
        watch.styles = './assets/js/**/*';
        watchTask.push('js')

        gulp.task('js', function() {
            gulp.src(paths.js.input)
                .pipe(plumber())
                .pipe(concat('scripts.js'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(output('js')))
                .pipe(livereload());
        });
    }

    if (active('views')) {
        watch.styles = './assets/views/**/*';
        watchTask.push('views')

        gulp.task('views', function buildHTML() {
            gulp.src(output('views') + '/*.html')
                .pipe(clean())

            gulp.src(paths.views.input)
                .pipe(plumber())
                .pipe(pug())
                .pipe(gulp.dest(output('views')))
                .pipe(livereload());
        })
    }

    gulp.task('watch', function() {
        livereload.listen();
        autowatch(gulp, watch);
    });

    watchTask.push('watch')

    gulp.task('cupcoffee', watchTask);

    return gulp
}
