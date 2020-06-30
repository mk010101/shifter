const gulp = require('gulp');
const bSync = require('browser-sync').create();
const rollup = require("rollup");






gulp.task('bSync', function() {
    bSync.init({
        server: {
            baseDir: "./example",
            directory: true,
        },
        //host: process.env.BSYNC_HOST || undefined,
       //proxy: "192.168.0.13",
       //proxy: "b-sync",
        port: 3030,

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
    input: "./src/shifter.js"
};



const outputOptions = {
    format: "esm", // required
    file: "./example/libs/shifter.js",
    //file: "shifter.js",
    //dir :"./example/libs",
    name: "Shifter", // exposed name of the lib.
    exports: "named",
    globals: "window"
};

gulp.task('package', ()=> {

    return new Promise(async (resolve) => {


        const bundle = await rollup.rollup(inputOptions)
            .catch((err)=> {console.log(err)});


        if (bundle) await bundle.write(outputOptions);


        bSync.reload({stream: false});

        resolve();

    });



});


gulp.task('web', () => {

    return new Promise(async (resolve) => {

        const bundle = await rollup.rollup({input: "./src/shifter.js"})
            .catch((err) => {
                console.log(err)
            });

        if (bundle) await bundle.write({
            format: "umd", // required
            //format: "esm", // required
            file: "./build/umd/shifter.js",
            name: "shifter", // exposed name of the lib.
            exports: "named",
            globals: "window"
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

