# Gulp CupCoffee
Gulp mechanism for Coffee Cup Client Framework

# Use
in `gulpfile.js`

```javascript
var cupcoffee = require('gulp-cupcoffee');

var gulp = cupcoffee()

gulp.task('custom', function() {
    gulp.src('./mypath')
        .pipe(gulp.dest('./mydest'))
});

gulp.task('default', ['cupcoffee', 'custom']);

```

## Components
**gulp-cupcoffee** comes with several libraries included, these are:
```javascript
"gulp": "^3.9.1",
"gulp-autowatch": "^1.0.2",
"gulp-clean": "^0.3.2",
"gulp-clean-css": "^2.0.13",
"gulp-concat": "^2.6.0",
"gulp-less": "^3.1.0",
"gulp-livereload": "^3.8.1",
"gulp-minify": "0.0.14",
"gulp-plumber": "^1.1.0",
"gulp-pug": "^3.1.0",
"gulp-sourcemaps": "^2.1.1",
"gulp-stylus": "^2.5.0",
"gulp-watch": "^4.3.10",
"merge": "^1.2.0",
"path-exists": "^3.0.0"
```

You configure the Automation or canceled as follows:

```javascript
var gulp = cupcoffee({  
  js: {
    //Adding Components to scripts.js
    input: [
      './bower_components/bootstrap/dist/js/bootstrap.min.js',
      './myLib/lib.js',
    ]
  },
  images: false, //Nothing will be done with images
  views: {
    output: './public/' //the output of views will be /public/*.html
  }
})
```

The available components are:
 - fonts
 - images
 - css
 - js
 - less
 - stylus
 - views (pug files)

The **livereload** is configured to know more about it see [https://www.npmjs.com/package/gulp-livereload](https://www.npmjs.com/package/gulp-livereload)
