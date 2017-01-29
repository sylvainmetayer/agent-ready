// generated on 2017-01-26 using generator-webapp 2.3.2
// File edited manually.
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const jsonminify = require('gulp-jsonminify');
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;

gulp.task('styles', () => {
    return gulp.src('app/styles/*.css')
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});

gulp.task("favicons", () => {
    return gulp.src(["./app/*.png", "./app/browserconfig.xml", "./app/favicon.ico", "./app/manifest.json"])
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', () => {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(reload({stream: true}));
});

gulp.task('json', function () {
    return gulp.src(['app/resources/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist/resources'));
});

gulp.task('html', ['styles', 'scripts'], () => {
    return gulp.src('app/index.html')
        .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
    runSequence(['clean'], ['styles', 'scripts'], () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'app']
            }
        });

        gulp.watch([
            'app/*.html',
            'app/images/**/*'
        ]).on('change', reload);

        gulp.watch('app/styles/**/*.css', ['styles']);
        gulp.watch('app/scripts/**/*.js', ['scripts']);
    });
});

gulp.task('serve:dist', ['default'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist']
        }
    });
});

gulp.task('build', ['html', 'images', "json", "favicons"], () => {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('deploy', ['default'], () => {
    return gulp.src('dist/**/*')
        .pipe($.ghPages());
});

gulp.task('default', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean'], 'build', resolve);
    });
});
