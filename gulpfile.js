const gulp = require('gulp');
const bSync = require('browser-sync').create();
const rollup = require("rollup");


gulp.task('bSync', function() {
    bSync.init({
        server: {
            baseDir: "./example",
            directory: true
        },

    });
});

/* =====================================================================================
 WATCH
 ======================================================================================*/
gulp.task('watch', ()=> {
    gulp.watch('./src/**/*.js', gulp.series(['package']));

});


/* =====================================================================================
    MAIN
======================================================================================*/
    gulp.task('default', gulp.parallel(['bSync', 'watch']));




/* =====================================================================================
 ROLLUP
 ======================================================================================*/

const inOptions = {

};

const outOptions = {

};

gulp.task('package', ()=> {

    return new Promise(async resolve => {


        const bundle = await rollup.rollup({
            input: './src/Shifter.js',
        });

        await bundle.write({
            file: './example/libs/shifter.js',
            format: 'esm',
            name: 'shifter',
            sourcemap: true
        });

        bSync.reload({stream: false});

        resolve();

    });



});






/* =====================================================================================
 CLEARS CONSOLE WINDOW
 ======================================================================================*/
function clear() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
}

