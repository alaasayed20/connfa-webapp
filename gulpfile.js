var gulp = require('gulp');
var config = require('./gulpfile-config.json');
var tar = require('gulp-tar');

var sassThemePath = (config.theme == null) ? 'assets/themes/default' : 'assets/themes/' + config.theme;
var assetsDev = 'public/**/*';
var assetsProd = 'dist/public/';

var ext_replace = require('gulp-ext-replace');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var precss = require('precss');
var cssnano = require('cssnano');
var runSequence = require('run-sequence');

gulp.task('build-assets', function () {
	return gulp.src(assetsDev)
		.pipe(gulp.dest(assetsProd));
});

gulp.task('build-scss', function () {
	return gulp.src('src/' + sassThemePath + '/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({includePaths: ['src/' + sassThemePath + '/components']}))
		.pipe(postcss([precss, cssnano]))
		.pipe(sourcemaps.write())
		.pipe(ext_replace('.css'))
		.pipe(gulp.dest('public/styles/'));
});

gulp.task('build-js', function () {
	return gulp.src('src/assets/js/**/*.js')
		.pipe(gulp.dest('public/js/'));
});

gulp.task('build-images', function () {
	return gulp.src('src/assets/images/**/*')
		.pipe(gulp.dest('public/images/'));
});

gulp.task('manifest', function () {
	gulp.src('src/assets/manifest.json')
		.pipe(gulp.dest('public/'));
});

gulp.task('sw', function () {
	gulp.src('public/service-worker.js')
		.pipe(gulp.dest('dist/'));
})

gulp.task('htaccess', function () {
	gulp.src('public/.htaccess')
		.pipe(gulp.dest('dist'));
});

gulp.task('tar', function () {
	gulp.src('dist/**', {
		dot: true
	}).pipe(tar('dist.tar')).pipe(gulp.dest('./'))
})

gulp.task('watch', function () {
	gulp.watch('src/' + sassThemePath + '/**/*', ['build-scss', 'build-assets']);
	gulp.watch('src/assets/js/**/*', ['build-js', 'build-assets']);
	gulp.watch('src/assets/images/**/*', ['build-images', 'build-assets']);
	gulp.watch('src/assets/manifest.json', ['manifest', 'build-assets']);
	gulp.watch('src/service-worker.js', ['sw', 'build-assets']);
});

gulp.task('build',runSequence('manifest', 'build-scss', 'build-js', 'build-images', 'sw', 'build-assets', 'htaccess'));
gulp.task('deploy-tar', ['tar']);
