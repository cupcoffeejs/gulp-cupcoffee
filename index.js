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


    var root = (name) => {
        if (name) {
            return (paths.root) ? path.resolve(paths.root, name) : path.resolve('./app', name)
        } else
            return paths.root || './app'
    }

    var pathsJsBefore = [
        path.resolve(__dirname, '..', 'vue/dist/vue.min.js'),
        path.resolve(__dirname, '..', 'jquery/dist/jquery.min.js'),
        path.resolve(__dirname, '..', 'cupcoffee-client/src/cupcoffee.js')
    ]

    var pathsJsAfter = [
        root('libs/*.js'),
        root('services/*.js'),
        root('controllers/*.js'),
        root('config/*.js'),
        root('app.js')
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
            if (name == 'stylus' || name == 'less') {
                name = 'css';
            }
            return path.resolve(paths.output || './public', name)
        }
    }

    var assets = (name) => {
        if (paths.assets) {
            return path.resolve(paths.assets, name, '**/*');
        } else {
            return path.resolve('./assets', name, '**/*');
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

    if (active('copy')) {
        watchTask.push('copy')

        gulp.task('copy', function() {
            paths.copy.map((copy) => {
                gulp.src(copy.input).pipe(gulp.dest(copy.output))
            })
        });
    }

    if (active('fonts')) {
        watch.fonts = assets('fonts');
        watchTask.push('fonts')

        gulp.task('fonts', function() {
            gulp.src(paths.fonts.input || assets('fonts'))
                .pipe(gulp.dest(output('fonts')))
        });
    }

    if (active('images')) {
        watch.images = assets('images');
        watchTask.push('images')

        gulp.task('images', function() {
            gulp.src(paths.images.input || assets('images'))
                .pipe(gulp.dest(output('images')))
        });
    }

    if (active('less')) {
        watch.less = assets('less');
        watchTask.push('less');

        gulp.task('less', function() {
            gulp.src(paths.less.input || assets('less'))
                .pipe(plumber())
                .pipe(less({
                    paths: [path.join(__dirname, 'less', 'includes')]
                }))
                .pipe(gulp.dest(output('less')));
        });
    }

    if (active('stylus')) {
        watch.stylus = pathExists(assets('styl')) ? assets('styl') : assets('stylus');
        watchTask.push('stylus');

        gulp.task('stylus', function() {
            gulp.src(paths.stylus.input || watch.stylus)
                .pipe(plumber())
                .pipe(({
                    'include css': true
                }))
                .pipe(cleanCSS())
                .pipe(gulp.dest(output('stylus')))
                .pipe(livereload());
        });
    }

    if (active('css')) {
        watch.css = assets('css');
        watchTask.push('css')

        gulp.task('css', function() {
            gulp.src(paths.css.input || assets('css'))
                .pipe(cleanCSS())
                .pipe(concat(paths.css.filename || 'styles.css'))
                .pipe(gulp.dest(output('css')))
        });

    }

    if (active('js')) {
        watch.js = path.resolve(root(), '**/*.js');
        watchTask.push('js')

        gulp.task('js', function() {
            gulp.src(paths.js.input)
                .pipe(plumber())
                .pipe(concat(paths.js.filename || 'scripts.js'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(output('js')))
                .pipe(livereload());
        });
    }

    if (active('views')) {
        watch.views = path.resolve(root('views'), '**/*.{pug,jade}')
        watchTask.push('views')

        gulp.task('views', function buildHTML() {
            gulp.src(output('views') + '/*.html')
                .pipe(clean())

            gulp.src(paths.views.input || path.resolve(root('views'), 'templates/*.{pug,jade}'))
                .pipe(plumber())
                .pipe(pug())
                .pipe(gulp.dest(output('views')))
                .pipe(livereload());
        })
    }

    gulp.task('watch', function() {
        livereload.listen();
        console.log(watch)
        autowatch(gulp, watch);
    });

    watchTask.push('watch')

    gulp.task('cupcoffee', watchTask);

    return gulp
}
