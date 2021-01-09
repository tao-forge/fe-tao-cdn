module.exports = function(grunt) {
    'use strict';

    var root    = grunt.option('root') + '/taoQtiTestPreviewer/views/';
    var pluginDir = root + 'js/runner/plugins/';

    grunt.config.merge({
        sass : {
            taoqtitestpreviewer: {
                files : [{
                    expand: true,
                    src: root + 'js/**/scss/*.scss',
                    rename : function rename(dest, src){
                        return src.replace(/scss/g, 'css');
                    }
                }]
            },
        },
        watch : {
            taoqtitestpreviewersass : {
                files : [root + 'scss/**/*.scss', pluginDir + '**/*.scss'],
                tasks : ['sass:taoqtitestpreviewer'],
                options : {
                    debounceDelay : 1000
                }
            }
        },
        notify : {
            taoqtitestpreviewersass : {
                options: {
                    title: 'Grunt SASS',
                    message: 'SASS files compiled to CSS'
                }
            }
        }
    });

    //register an alias for main build
    grunt.registerTask('taoqtitestpreviewersass', ['sass:taoqtitestpreviewer']);
};
