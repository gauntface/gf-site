const BlogModel = require('./blog-model');

const TABLE_NAME = 'draft_posts_table';

module.exports = new BlogModel(TABLE_NAME);
