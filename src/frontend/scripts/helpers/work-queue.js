export default class WorkQueue {
  constructor() {
    this._workQueue = {};
  }

  addJob(jobid, jobFunction, maxSize) {
    if (!this._workQueue[jobid]) {
      this._workQueue[jobid] = {
        isWorking: false,
        jobs: []
      };
    }

    if (this._workQueue[jobid].jobs.length < maxSize) {
      this._workQueue[jobid].jobs.push(jobFunction);
      this.jobUpdate(jobid);
      return true;
    }

    return false;
  }

  jobUpdate(jobid) {
    if (this._workQueue[jobid].isWorking ||
      this._workQueue[jobid].jobs.length === 0) {
      return;
    }

    this._workQueue[jobid].isWorking = true;
    const currentJob = this._workQueue[jobid].jobs.shift();
    let result = currentJob();
    if (!(result instanceof Promise)) {
      throw new Error('Bad job result. No Promise returned.');
    }
    result.then(() => {
      this._workQueue[jobid].isWorking = false;
      this.jobUpdate(jobid);
    });
  }
}
