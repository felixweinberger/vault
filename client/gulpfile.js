const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
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

// Remove solutions from exercises
gulp.task('remove-solutions', () => {
  del.sync('dist');
  return gulp.src(addDefSrcIgnore(['**', '!**/REMOVE{,/**}']), { dot: true })
    .pipe($.replace(/^\s*(\/\/|<!--|\/\*)\s*REMOVE-START[\s\S]*?REMOVE-END\s*(\*\/|-->)?\s*$/gm, ''))
    .pipe(gulp.dest('dist'));
});

// Prepare for distribution to students
gulp.task('dist', ['lint', 'remove-solutions'], () => {
  let npmConfig = require('./package.json');
  delete npmConfig.scripts.install;
  npmConfig = JSON.stringify(npmConfig, null, 2).replace(/-master/g, '');
  fs.writeFileSync('dist/package.json', npmConfig);
});
