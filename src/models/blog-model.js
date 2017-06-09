const dbHelper = require('../utils/database-helper');
const SinglePostModel = require('./single-post-model');

const TABLE_NAME = 'posts_table';

class BlogModel {
  addPost(post) {
    return dbHelper.executeQuery(`INSERT INTO posts_table (
        draftDate,
        publishDate,
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
        post.excerptMarkdown,
        post.bodyMarkdown,
        post.mainImage,
        post.mainImageBgColor,
        post.slug,
        post.status,
      ]);
  }

  getPosts(options) {
    let sqlQuery = `SELECT * FROM ${TABLE_NAME}`;
    let args = [];
    if (options.where) {
      // TODO: Convert this to question marks
      const whereClause = options.where.clauses.join(' AND ');
      args = args.concat(options.where.args);
      sqlQuery = `${sqlQuery} WHERE ${whereClause}`;
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

    return dbHelper.executeQuery(sqlQuery, args)
    .then((rawResults) => {
      return rawResults.map((rawResult) => {
        return new SinglePostModel(rawResult);
      });
    });
  }

  getPublishedPosts(count, offset) {
    return this.getPosts({
      where: {
        clauses: [
          'status = ?',
          'slug IS NOT NULL',
          'bodyMarkdown IS NOT NULL',
        ],
        args: [
          'published',
        ],
      },
      count,
      offset,
      order: `publishDate DESC`,
    });
  }

  getPostFromDetails(year, month, day, slug, status) {
    const whereClauses = [
      'DATE(publishDate) = ?',
      'slug = ?',
      'bodyMarkdown IS NOT NULL',
    ];
    const whereArgs = [
      `${year}-${month}-${day}`,
      slug,
    ];

    if (status) {
      whereClauses.push('status = ?');
      whereArgs.push(status);
    }

    return this.getPosts({
      where: {
        clauses: whereClauses,
        args: whereArgs,
      },
    })
    .then((posts) => {
      if (posts.length === 0) {
        return null;
      } else if (posts.length !== 1) {
        throw new Error('More than one result when retrieving blog post' +
          whereArgs.join(', '));
      }

      return posts[0];
    });
  }
}

module.exports = new BlogModel();
