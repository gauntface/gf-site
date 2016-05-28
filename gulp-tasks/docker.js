'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const path = require('path');
const runSequence = require('run-sequence');

const DOCKER_INSTANCE_NAME = 'gulp-docker';
const DOCKER_PORT = 5123;

// docker rm $(docker ps -a -q)
// docker rmi $(docker images -q)

// Can use --no-cache for clean builds

gulp.task('docker:build:prod', ['docker:build:base'], cb => {
  const args = [
    'build',
    '-t',
    'gauntface/gf-site:prod',
    '-f',
    GLOBAL.config.src+'/docker/Dockerfile-Prod',
    '.'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:build:staging', ['docker:build:base'], cb => {
  const args = [
    'build',
    '-t',
    'gauntface/gf-site:staging',
    '-f',
    GLOBAL.config.src+'/docker/Dockerfile-Staging',
    '.'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:build:dev', ['docker:build:base'], cb => {
  const args = [
    'build',
    '-t',
    'gauntface/gf-site:dev',
    '-f',
    GLOBAL.config.src+'/docker/Dockerfile-Dev',
    '.'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:build:base', cb => {
  const args = [
    'build',
    // '--no-cache',
    '-t',
    'gauntface/gf-site:base',
    '-f',
    GLOBAL.config.src+'/docker/Dockerfile-Base',
    '.'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:cli', cb => {
  const args = [
    'exec',
    '-it',
    DOCKER_INSTANCE_NAME,
    'bash'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:stop', cb => {
  const args = [
    'stop',
    DOCKER_INSTANCE_NAME
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:remove', ['docker:stop'], (cb) => {
  const args = [
    'rm',
    DOCKER_INSTANCE_NAME
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:startStaging', (cb) => {
  const startDocker = function() {
    const args = [
      'run',
      '--name',
      DOCKER_INSTANCE_NAME,
      '--net',
      'host',
      '-e',
      'NGINX_PORT='+DOCKER_PORT,
      '-e',
      'BUILDTYPE=staging',
      '-p',
      GLOBAL.config.dockerport,
      '-t',
      'gauntface/gf-site:staging'
    ];

    console.log();
    console.log('docker ' + args.join(' '));
    console.log();
    //args.forEach(arg => console.log(arg));
    //'-d',
    const dockerProcess = spawn('docker', args, {
      stdio: 'inherit'
    });

    dockerProcess.on('exit', () => {
      cb();
    });
  };

  runSequence(
    'docker:remove',
    'docker:build:staging',
      startDocker);
});

gulp.task('docker:start', (cb) => {
  function startDocker() {
    const args = [
      'run',
      '--name',
      DOCKER_INSTANCE_NAME,
      '--net',
      'host',
      '-e',
      'NGINX_PORT='+DOCKER_PORT,
      '-e',
      'BUILDTYPE=development',
      '-p',
      GLOBAL.config.dockerport,
      '-v',
      path.join(__dirname, '..', GLOBAL.config.dest)+':/gauntface/site',
      '-d',
      '-t',
      'gauntface/gf-site:dev'
    ];
    console.log();
    console.log('docker ' + args.join(' '));
    console.log();
    //args.forEach(arg => console.log(arg));
    //'-d',
    const dockerProcess = spawn('docker', args, {
      stdio: 'inherit'
    });

    dockerProcess.on('exit', () => {
      cb();
    });
  }

  runSequence(
    'docker:remove',
    'docker:build:dev',
    startDocker);
});
