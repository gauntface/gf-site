const gulp = require('gulp');
const path = require('path');
const fs = require('fs-extra');
const getTaskFilepaths = require('./gulp-tasks/utils/get-task-filepaths');

global.__buildConfig = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'build'),
  private: path.join(__dirname, '..', 'gf-deploy'),
  dockerBuild: path.join(__dirname, '..', 'gf-deploy', 'docker-build'),
};

const loadTasks = () => {
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {task} = require(taskFilepath);
    if (task) {
      gulp.task(task);
    }
  }
};

loadTasks();

gulp.task('dev', (done) => {
  return gulp.series([
    'build',
    'thirdparty',
    // 'serviceWorker',
    gulp.parallel([
      'watch',
      'docker:run:dev',
    ]),
  ])(done);
});

gulp.task('testing', (done) => {
  return gulp.series([
    'build',
    'thirdparty',
    // 'serviceWorker',
    gulp.parallel([
      'watch',
      'docker:run:testing',
    ]),
  ])(done);
});

gulp.task('prod', (done) => {
  return gulp.series([
    'build',
    'thirdparty',
    // 'serviceWorker',
    gulp.parallel([
      'watch',
      'docker:run:prod',
    ]),
  ])(done);
});

gulp.task('prod:save', gulp.series([
  async () => {
    await fs.remove(global.__buildConfig.dockerBuild);
  },
  'build',
  'thirdparty',
  // 'serviceWorker',
  'docker:save:prod',
  async () => {
    return Promise.all([
      fs.copy(
        path.join(global.__buildConfig.private, 'docker-compose.prod.yml'),
        path.join(global.__buildConfig.dockerBuild, 'docker-compose.prod.yml'),
      ),
    ]);
  },
]));
