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

const inputOptions = {
    input: "./src/Shifter.js"
};



const outputOptions = {
    format: "esm", // required
    file: "./example/libs/Shifter.js",
    //file: "shifter.js",
    //dir :"./example/libs",
    name: "Shifter", // exposed name of the lib.
    exports: "named",
    globals: "window"
};

gulp.task('package', ()=> {

    return new Promise(async resolve => {


        const bundle = await rollup.rollup(inputOptions);

        await bundle.write(outputOptions);

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

