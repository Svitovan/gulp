const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const path = require('path');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const smartgrid = require('smart-grid');

let isDev = true;
// let isProd = !isDev;
// let isDev = process.argv.includes('--dev');
// console.log(process.argv);

let config = {
    src: './src/',
    build: './build/',
    html: {
        src: '**/*.html',
        dest: '/'
    },
    css: {
        src: 'css/*',
        dest: '/css'
    },
    img: {
        src: 'img/*',
        dest: '/img'
    }
};

function html(){
    return gulp.src(config.src + config.html.src)
        .pipe(gulp.dest(config.build + config.html.dest));
}

function css(){
    return gulp.src(config.src + config.css.src)
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 3 version']           
        }))
        .pipe(cleanCSS({compatibility: 'ie8',
                        level: 1 }))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest(config.build + config.css.dest)); 
}

function lessFrom(){
    return gulp.src('./src/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./src/css/'));
}

function img(){
    return gulp.src(config.src + config.img.src)
        .pipe(gulp.dest(config.build + config.img.dest));
}

function grid(done){
	let gridSettings = {
		container: {
	        maxWidth: "900px",
	        fields: "30px"
	    },
		breakPoints: {
			
		}
	};

	smartgrid(config.src + 'less', gridSettings);
	done();
}

function clear(){
    return del(config.build + '/*');
}

function watch(){
    gulp.watch(config.src + config.css.src, css);
    gulp.watch(config.src + config.html.src, html);
    gulp.watch('./src/less/*.less', lessFrom);
}

gulp.task('html', html);
gulp.task('img', img);
gulp.task('css', css); 
gulp.task('clear', clear);
gulp.task('less', lessFrom);
gulp.task('watch', watch);
gulp.task('grid', grid);

let build = gulp.series(clear, gulp.parallel(html, img, css));

gulp.task('build', build);
gulp.task('dev', gulp.series(build, watch));








