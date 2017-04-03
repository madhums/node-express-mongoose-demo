var options = {
    cleanCss: {
        s0: true
    }
};

function taskLocale(grunt) {
    var tasks = [];
    grunt.task.run(tasks);
}

module.exports = function (grunt) {
    
    var lessFolderPath = 'less';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            options: {
                plugins: [
                    new (require('less-plugin-clean-css'))(options.cleanCss)
                ]
            },
            files: {
                expand: true,
                cwd: lessFolderPath + '/',
                dest: "public/css/",
                src: "general.less",
                ext: ".css"
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
                cascade: false
            },
            files: {
                'public/css/general.css': 'public/css/general.css'
            }
        },
        watch: {
            less: {
                files: 'less/**/*.less',
                tasks: ['less']
            }
        },
        clean: {
            build: [
                'public/css/clean-styles.css'
            ]
        }
        
    });
    
    
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', '', function fn() {
        var tasks = ['watch:less', 'watch:css'];
        
        taskLocale(grunt);
        grunt.task.run(tasks);
    });
    
    grunt.event.on('watch', function (action, filepath, target) {
        var filePathName = filepath.replace(lessFolderPath + '\\', '');
        var fileName = filePathName.replace('.less', '');
        
        grunt.log.writeln(target + ': ' + filePathName + ' has ' + action);
        
        grunt.config('autoprefixer.multiple_files.src', [fileName + '.css']);
        grunt.config('less.files.src', [filePathName]);
    });
    
};
