module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    ts: {
      server: {
        files: [{
          src: ["src/server/\*.ts", "!src/.baseDir.ts"],
          dest: "src/server"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false
        }
      }
    },
    watch: {
      ts: {
        files: ["src/server/\*.ts"],
        tasks: ["ts"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "ts"
  ]);

};