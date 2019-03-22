var syntax        		= 'sass', // Syntax: sass or scss;
	gulpversion   		= '4'; // Gulp version: 3 or 4

	var gulp          	= require('gulp'),
		gutil         	= require('gulp-util' ),
		sass          	= require('gulp-sass'),
		webp 			= require('gulp-webp'),
		browserSync   	= require('browser-sync'),
		concat        	= require('gulp-concat'),
		uglify        	= require('gulp-uglify'),
		cleancss      	= require('gulp-clean-css'),
		rename        	= require('gulp-rename'),
		del            	= require('del'),
		cache          	= require('gulp-cache'),
		autoprefixer  		= require('gulp-autoprefixer'),
		notify        		= require('gulp-notify'),
		imagemin      		= require('imagemin'),
		imageminWebp 		= require('imagemin-webp'),
		responsive 			= require('gulp-responsive'),
		imageminJpegtran 	= require('imagemin-jpegtran'),
		imageminJpegoptim 	= require('imagemin-jpegoptim'),
		imageminPngquant 	= require('imagemin-pngquant'),
		fileinclude    		= require('gulp-file-include'),
		gulpRemoveHtml 		= require('gulp-remove-html'),
		bourbon       		= require('node-bourbon'),
		ftp           		= require('vinyl-ftp'),
		gulpIf 				= require('gulp-if'),
		rsync         		= require('gulp-rsync');

gulp.task('headersass', function() {
	return gulp.src('app/header.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/slick/slick.min.js',
		//'app/libs/smoothscroll.js',
		'app/libs/jquery.poptrox.min.js',
		'app/libs/browser.min.js',
		'app/libs/lazysizes.min.js',
		'app/libs/intlTelInput/intlTelInput.js',
		'app/libs/magnific-popup/jquery.magnific-popup.min.js',
		'app/js/common.js',
		//'app/js/sender_lp.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('build', function(done) {

	var removedist = del.sync('dist');

	var buildhtml = gulp.src('app/*.html')
	    .pipe(fileinclude({
	      prefix: '@@'
	    }))
	    .pipe(gulpRemoveHtml())
	    .pipe(gulp.dest('dist'));
	
	var buildCss = gulp.src([
		'app/css/main.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildFiles = gulp.src([
		'app/ht.access'
	]).pipe(gulp.dest('dist'));

	var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));

	var buildImgMobile = gulp.src(['app/img/*.{jpg,png}'])
    .pipe(responsive({
      '*.jpg': [{
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.jpg'
        }
      }, {
        // Convert images to the webp format
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.webp'
        }
      }],
      '*.png': [{
        width: 320,
        rename: {
          //suffix: '_m',
          extname: '.png'
        },
        format: 'png'
      }, {
        // Convert images to the webp format
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.webp'
        }
      }]
    }, {
      // Global configuration for all images
      quality: 80,
      progressive: false,
      withMetadata: true,
      errorOnEnlargement: false
    }))
    .pipe(gulp.dest('dist/m/img'));


	(async () => {
		const webp = await imagemin(['app/img/*.{jpg,png}'], 'dist/img', {
			use: [
				imageminWebp({quality: 80})
			]
		});

		const jpg = await imagemin(['app/img/*.{jpg,png}'], 'dist/img', {
			use: [
				imageminWebp({progressive: true})
			]
		});

		const png = await imagemin(['app/img/*.{jpg,png}'], 'dist/img', {
			plugins: [
				imageminPngquant({
					quality: [0.75, 0.85]
				})
			]
		});

		console.log(jpg);
		//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
	})();

	done();

});

gulp.task('bld', function(done) {


	var buildhtml = gulp.src('app/*.html')
	    .pipe(fileinclude({
	      prefix: '@@'
	    }))
	    .pipe(gulpRemoveHtml())
	    .pipe(gulp.dest('dist'));
	
	var buildCss = gulp.src([
		'app/css/main.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));

	done();

});

gulp.task('buildhtmlwatch', function() {
	return gulp.src('app/*.html')
	    .pipe(fileinclude({
	      prefix: '@@'
	    }))
	    .pipe(gulpRemoveHtml())
	    .pipe(gulp.dest('dist'));
});

gulp.task('processImages', function () {
  return gulp.src(['app/img/*.{jpg,png}'])
    .pipe(responsive({
      '*.jpg': [{
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.jpg'
        }
      }, {
        // Convert images to the webp format
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.webp'
        }
      }],
      '*.png': [{
        width: 320,
        rename: {
          //suffix: '_m',
          extname: '.png'
        },
        format: 'png'
      }, {
        // Convert images to the webp format
        width: 700,
        rename: {
          //suffix: '_m',
          extname: '.webp'
        }
      }]
    }, {
      // Global configuration for all images
      quality: 80,
      progressive: false,
      withMetadata: true,
      errorOnEnlargement: false
    }))
    .pipe(gulp.dest('app/m/img'));
});

gulp.task('webpImages', function () {
	(async () => {
		const webp = await imagemin(['app/img/*.{jpg,png}'], 'app/img', {
			use: [
				imageminWebp({quality: 70})
			]
		});
		console.log(webp);
		//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
	})();
});

gulp.task('watch', function() {
	gulp.watch('app/header.sass', gulp.parallel('headersass'));
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/*.html', gulp.parallel('buildhtmlwatch'));
	//gulp.watch('app/img/**/*', gulp.parallel('imagesminWebp'));
});


gulp.task('deploy', function () {

	var conn = ftp.create( {
		host:     'ludibg.ftp.tools',
		user:     'ludibg_deploy',
		pass: '4T3X9MgtzD1b',
		idleTimeout: 100,
		log:      gutil.log
	});

	console.log(conn);

    var globs = [
		'./dist/img/**/*',
		'./dist/fonts/**/*',
        './dist/css/*.*',
        './dist/js/*.*',
		'./dist/ht.access',
        './dist/*.html',
    ];

    return gulp.src(globs, { base: './dist', buffer: false })
        //.pipe(conn.newer('/instamania.com.ua/www/_dev'));
        .pipe(conn.dest('/salesgeneration.top/www/lp'));
});

gulp.task('dep', function () {

	var conn = ftp.create( {
		host:     'ludibg.ftp.tools',
		user:     'ludibg_deploy',
		pass: '4T3X9MgtzD1b',
		idleTimeout: 100,
		log:      gutil.log
	});

	console.log(conn);

    var globs = [
        './dist/css/*.*',
        './dist/js/*.*',
        './dist/*.html',
    ];

    return gulp.src(globs, { base: './dist', buffer: false })
        //.pipe(conn.newer('/instamania.com.ua/www/_dev'));
        .pipe(conn.dest('/salesgeneration.top/www/lp'));
});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', gulp.parallel('webpImages', 'processImages', 'styles', 'scripts', 'browser-sync', 'watch'));