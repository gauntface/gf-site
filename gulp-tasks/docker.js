'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const path = require('path');
const runSequence = require('run-sequence');

const DOCKER_INSTANCE_NAME = 'gulp-docker';
const DOCKER_PORT = 3000;

// docker rm $(docker ps -a -q)
// docker rmi $(docker images -q)
// Can use --no-cache for clean builds


function runDockerBuild(buildType, cb) {
  const args = [
    'build',
    '-t',
    `gauntface/gf-site:${buildType}`,
    '-f',
    GLOBAL.config.src+`/docker/Dockerfile-${buildType}`,
    '.'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
}

const buildTypes = [
  'development',
  'test',
  'staging',
  'production'
];


buildTypes.forEach(buildType => {
  gulp.task(`docker:build:${buildType}`, ['docker:build:base'], cb => {
    runDockerBuild(buildType, cb);
  });
});

gulp.task('docker:build:base', cb => {
  runDockerBuild('base', cb);
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

gulp.task('docker:start:development', (cb) => {
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
      'gauntface/gf-site:development'
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
    'docker:build:development',
    startDocker);
});

gulp.task('docker:start:test', (cb) => {
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
      'BUILDTYPE=test',
      '-p',
      GLOBAL.config.dockerport,
      '-v',
      path.join(__dirname, '..', GLOBAL.config.dest)+':/gauntface/site',
      '-d',
      '-t',
      'gauntface/gf-site:test'
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
    'docker:build:test',
    startDocker);
});
