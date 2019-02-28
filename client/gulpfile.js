const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// Utility to ignore unnecessary files
// when generating the glob patterns array for gulp.src()
function addDefSrcIgnore(srcArr) {
  return srcArr.concat([
    '!node_modules{,/**}',
    '!private{,/**}',
    '!dist{,/**}',
    '!.git{,/**}',
    '!**/.DS_Store',
  ]);
}

// JavaScript and JSON linter
gulp.task('lint', () => gulp.src(addDefSrcIgnore(['**/*.js', '*.json']), { dot: true })
  .pipe($.eslint({ dotfiles: true }))
  .pipe($.eslint.format())
  .pipe($.eslint.failAfterError()));
