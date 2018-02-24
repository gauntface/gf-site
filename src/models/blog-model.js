const dbHelper = require('../utils/database-helper');
const SinglePostModel = require('./single-post-model');

const urldecode = function(str) {
  return decodeURIComponent((str + '').replace(/\+/g, '%20'));
};

class BlogModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  addPost(post) {
    return dbHelper.executeQuery(`INSERT INTO ${this.tableName} (
        lastUpdate,
        title,
        excerptMarkdown,
        bodyMarkdown,
        mainImage,
        mainImageBgColor,
        slug
      ) VALUES (
        NOW(),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`, [
        post.title,
        post.excerptMarkdown,
        post.bodyMarkdown,
        post.mainImage,
        post.mainImageBgColor,
        post.slug,
      ]);
  }

  getPosts(options) {
    let sqlQuery = `SELECT * FROM ${this.tableName}`;
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
        rawResult.title = urldecode(rawResult.title);
        rawResult.excerptMarkdown =
          rawResult.excerptMarkdown ?
          urldecode(rawResult.excerptMarkdown) : null;
        rawResult.bodyMarkdown =
          rawResult.bodyMarkdown ?
          urldecode(rawResult.bodyMarkdown) : null;
        rawResult.mainImageBgColor =
          rawResult.mainImageBgColor ?
          urldecode(rawResult.mainImageBgColor) : null;
        rawResult.mainImage =
          rawResult.mainImage ?
          urldecode(rawResult.mainImage) : null;
        return new SinglePostModel(rawResult);
      });
    });
  }

  getPublishedPosts(count, offset) {
    return this.getPosts({
      where: {
        clauses: [
          'slug IS NOT NULL',
          'bodyMarkdown IS NOT NULL',
        ],
        args: [
        ],
      },
      count,
      offset,
      order: `lastUpdate DESC`,
    });
  }

  getPostFromDetails(year, month, day, slug, status) {
    const whereClauses = [
      'DATE(lastUpdate) = ?',
      'slug = ?',
      'bodyMarkdown IS NOT NULL',
    ];
    const whereArgs = [
      `${year}-${month}-${day}`,
      slug,
    ];

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

  async getPostFromId(id) {
    const whereClauses = [
      'id = ?',
    ];
    const whereArgs = [
      id,
    ];

    const posts = await this.getPosts({
      where: {
        clauses: whereClauses,
        args: whereArgs,
      },
    });

    if (posts.length === 0) {
      return null;
    } else if (posts.length !== 1) {
      throw new Error('More than one result when retrieving blog post' +
        whereArgs.join(', '));
    }
    return posts[0];
  }
}

module.exports = BlogModel;
