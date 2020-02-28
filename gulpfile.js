const gulp = require('gulp');
const bsync = require('browser-sync').create();


gulp.task('b', function() {
    bsync.init({
        server: {
            baseDir: "./example",
            directory: true
        },

    });
});