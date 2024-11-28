// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessCustom'],
    singleRun: true,
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',               // Evita problemas de permisos
          '--disable-dev-shm-usage',    // Reduce el uso de /dev/shm
          '--disable-gpu',              // Desactiva la GPU
          '--disable-extensions',       // Desactiva extensiones de Chrome
          '--disable-software-rasterizer', // Evita problemas de renderizado
          '--disable-setuid-sandbox',   // Desactiva el sandboxing adicional
          '--database=/tmp/crashpad-db', // Ruta de la base de datos de crashpad
        ],
      },
    },
  });
};
