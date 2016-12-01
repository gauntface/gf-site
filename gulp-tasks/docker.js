'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const path = require('path');
const runSequence = require('run-sequence');

const DOCKER_INSTANCE_NAME = 'gulp-docker';
const MYSQL_DOCKER_INSTANCE_NAME = 'gf-mysql';
const DOCKER_PORT = 3000;

// docker rm $(docker ps -a -q)
// docker rmi $(docker images -q)
// Can use --no-cache for clean builds

function runDockerMysqlServer(cb) {
  const args = [
    'run',
    '--name',
    MYSQL_DOCKER_INSTANCE_NAME,
    '-e',
    'MYSQL_ROOT_PASSWORD=password',
    '-e',
    'MYSQL_USER=demo-user',
    '-e',
    'MYSQL_PASSWORD=password',
    '-e',
    'MYSQL_DATABASE=demo-db',
    '-d',
    'mysql/mysql-server:latest'
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
}


function runDockerBuild(buildType, cb) {
  const args = [
    'build',
    // '--no-cache',
    '-t',
    `gauntface/gf-site:${buildType}`,
    '-f',
    global.config.src+`/docker/Dockerfile-${buildType}`,
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

gulp.task('docker:stop:mysql', cb => {
  const args = [
    'stop',
    MYSQL_DOCKER_INSTANCE_NAME
  ];
  const dockerProcess = spawn('docker', args, {
    stdio: 'inherit'
  });

  dockerProcess.on('exit', () => {
    cb();
  });
});

gulp.task('docker:stop', ['docker:stop:mysql'], cb => {
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
    DOCKER_INSTANCE_NAME,
    MYSQL_DOCKER_INSTANCE_NAME
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
      '--link',
      `${MYSQL_DOCKER_INSTANCE_NAME}`,
      '-e',
      'NGINX_PORT='+DOCKER_PORT,
      '-e',
      'BUILDTYPE=staging',
      '-p',
      `${DOCKER_PORT}:${DOCKER_PORT}`,
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
    'docker:mysql',
      startDocker);
});

gulp.task('docker:start:development', (cb) => {
  function startDocker() {
    const args = [
      'run',
      '--name',
      DOCKER_INSTANCE_NAME,
      '--link',
      `${MYSQL_DOCKER_INSTANCE_NAME}`,
      '-e',
      'NGINX_PORT='+DOCKER_PORT,
      '-e',
      'BUILDTYPE=development',
      '-p',
      `${DOCKER_PORT}:${DOCKER_PORT}`,
      '-v',
      path.join(__dirname, '..', global.config.dest)+':/gauntface/site',
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
    'docker:mysql',
    'docker:build:development',
    startDocker);
});

gulp.task('docker:start:test', (cb) => {
  function startDocker() {
    const args = [
      'run',
      '--name',
      DOCKER_INSTANCE_NAME,
      '--link',
      `${MYSQL_DOCKER_INSTANCE_NAME}`,
      '-e',
      'NGINX_PORT='+DOCKER_PORT,
      '-e',
      'BUILDTYPE=test',
      '-p',
      `${global.config.dockerport}:${DOCKER_PORT}`,
      '-v',
      path.join(__dirname, '..', global.config.dest)+':/gauntface/site',
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
    'docker:mysql',
    startDocker);
});

gulp.task('docker:mysql', (cb) => {
  runDockerMysqlServer(cb);
});
