const BlogModel = require('./blog-model');

const TABLE_NAME = 'published_posts_table';

module.exports = new BlogModel(TABLE_NAME);
