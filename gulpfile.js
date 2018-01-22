/* gulp dependencies 	*/
const gulp 			= require('gulp'),
  sass 			= require('gulp-sass'),
  uglify 		= require('gulp-uglify'),
  rename 		= require('gulp-rename'),
  browserify 	= require('browserify'),
  babelify 		= require('babelify'),
  source 		= require('vinyl-source-stream'),
  gutil 		= require('gulp-util'),
  plumber 		= require('gulp-plumber'),
  notify 		= require('gulp-notify'),
  browserSync 	= require('browser-sync'),
  postcss 		= require('gulp-postcss'),
  autoprefixer 	= require('autoprefixer'),
  cssnano 		= require('cssnano'),
  sourcemaps    = require('gulp-sourcemaps'),
  babel 		= require('gulp-babel'),
  reload 		= browserSync.reload;

/* scripts task */
gulp.task("scripts", function(){
    browserify({
    	entries: './src/js/script.js',
    	debug: true
  	})
    .transform(babelify.configure({
        presets : ["es2015"]
    }))

    .bundle()
    .pipe(source('bundle.js'))
    //.pipe(uglify().on('error', gutil.log))
    .pipe(notify({ message: 'JavaScript konprimatua prest dago ;)' }))
    .pipe(gulp.dest('docs'));
});

/* service worker task */
gulp.task("sw", function(){
  gulp.src('src/js/sw.js')
  .pipe(babel({
        presets: ['env']
    }))
  .pipe(gulp.dest('docs'))
});

/* sass task */
let postcssPlugins = [
	autoprefixer({browsers: 'last 2 versions'}),
	cssnano()
];

gulp.task('sass', function() {
	gulp.src('src/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(sourcemaps.write())
    .pipe(notify({ message: 'CSSa prest dago ;)' }))
		.pipe(gulp.dest('docs'))

		/* postcss/cssnano task */
		.pipe(postcss(postcssPlugins))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('docs'))
		.pipe(reload({stream: true}))
});

/* reload task */
gulp.task('bs-reload', function() {
	browserSync.reload();
});

/* browser-sync for localhost */
gulp.task('browser-sync', function() {
	browserSync.init(['docs/*.css', 'docs/bundle.js'], {
		proxy: "localhost:8888/nahieran/docs" //Your URL
	});
});

/* watch scss, css, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'scripts', 'browser-sync'], function() {
	/* watch .scss files, run the sass task on change. */
	gulp.watch(['src/scss/*.scss', 'src/scss/**/**/*.scss'], ['sass']);
	/* watch .js files, run the scripts task on change. */
	gulp.watch(['src/js/*.js', 'src/js/*/*.js'], ['scripts']);
  /* register service worker */
	gulp.watch(['src/js/sw.js'], ['sw']);
	/* watch .html files, run the bs-reload task on change. */
	gulp.watch(['src/*.html'], ['bs-reload']);
});
