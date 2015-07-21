# StartFiles-Client-ES6-Bakbone-Gulp-JSPM
Start Files for a Client app using ES6, Bakbone, Gulp, and JSPM

##Steps to Create##
###JSPM###
####Install jspm CLI####
https://github.com/jspm/jspm-cli/wiki/Getting-Started
````
npm install jspm --save-dev
````
####Initialize JSPM####
````
jspm init

Package.json file does not exist, create it? [yes]: 
Would you like jspm to prefix the jspm package.json properties under jspm? [yes]: 
Enter server baseURL (public folder path) [.]: 
Enter jspm packages folder [./jspm_packages]: libs
Enter config file path [./config.js]: 
Configuration file config.js doesn't exist, create it? [yes]:
Enter client baseURL (public folder URL) [/]: 
Which ES6 transpiler would you like to use, Traceur or Babel? [traceur]: Babel
````
####Install Bower Hook for JSPM####
https://www.npmjs.com/package/jspm-bower-endpoint
```
npm install --save-dev jspm-bower-endpoint
jspm registry create bower jspm-bower-endpoint
```
####Setup Index File####
````html
<!doctype html>
<script src="jspm_packages/system.js"></script>
<script src="config.js"></script>
<script>
  System.import('app');
</script>
````


###Gulp###
####Install Gulp and Plugins####
JSPM currntly doesn't lend itself well to managing cli tools, so for gulp and plugins, we'll use NPM.
```
npm install gulp -g
npm install gulp --save-dev
npm install browser-sync --save-dev
```
####Setup Gulpfile####
````javascript
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
````

###Backbone###
####Install Backbone and Dependencies####
````
jspm install bower:jquery
jspm install bower:underscore
jspm install bower:backbone
````


  
##Steps to Run##
