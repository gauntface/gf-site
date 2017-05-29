const dbController = require('../controllers/DatabaseController');

const TABLE_NAME = 'posts_table';

class BlogModel {
  getPosts() {
    return dbController.executeQuery(`SELECT * FROM ${TABLE_NAME}`);
  }

  getPublishedPosts(count) {
    return this.getPosts();
  }
}

module.exports = new BlogModel();