const dbController = require('../controllers/DatabaseController');
const SinglePostModel = require('./single-post-model');

const TABLE_NAME = 'posts_table';

class BlogModel {
  addPost(post) {
    return dbController.executeQuery(`INSERT INTO posts_table (
        publishDate,
        draftDate,
        title,
        excerptMarkdown,
        bodyMarkdown,
        mainImage,
        mainImageBgColor,
        slug,
        status
      ) VALUES (
        NOW(),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`, [
        post.publishDate,
        post.title,
        post.excerpt,
        post.markdown,
        post.mainImage,
        post.mainImageBgColor,
        post.slug,
        post.status,
      ]);
  }

  getPosts(options) {
    let sqlQuery = `SELECT * FROM ${TABLE_NAME}`;

    if (options.where) {
      const whereClauses = Object.keys(options.where).map((whereArgKey) => {
        return `${whereArgKey}='${options.where[whereArgKey]}'`;
      });
      sqlQuery = `${sqlQuery} WHERE ${whereClauses.join(' AND ')}`;
    }

    if (options.order) {
      sqlQuery += ` ORDER BY ${options.order}`;
    }

    if (options.count) {
      sqlQuery += ` LIMIT ${options.count}`;
    }

    if (options.offset) {
      sqlQuery += ` OFFSET ${options.offset}`;
    }

    return dbController.executeQuery(sqlQuery)
    .then((rawResults) => {
      return rawResults.map((rawResult) => {
        return new SinglePostModel(rawResult);
      });
    });
  }

  getPublishedPosts(count, offset) {
    return this.getPosts({
      where: {
        'status': 'published',
      },
      count,
      offset,
      order: `publishDate DESC`,
    });
  }
}

module.exports = new BlogModel();