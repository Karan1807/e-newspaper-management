// server/routes/index.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ---------------------- Article Routes ----------------------
// router.get('/articles', (req, res) => {
//   db.query('SELECT * FROM Article', (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

router.get('/articles', (req, res) => {
  // Parse page and limit from query params, defaulting to 1 and 10 if not provided
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate that page and limit are positive integers
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  // Calculate the offset based on the page and limit
  const offset = (page - 1) * limit;

  // Count the total number of articles in the database
  const countQuery = 'SELECT COUNT(*) AS total FROM Article';
  db.query(countQuery, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to count articles' });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // If there are no articles, return an empty results array
    if (total === 0) {
      return res.json({
        page,
        limit,
        total,
        totalPages,
        results: [],
      });
    }

    // Fetch the paginated articles
    const query = 'SELECT * FROM Article LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve articles' });
      }

      // Return the paginated data along with the total count and total pages
      res.json({
        page,
        limit,
        total,
        totalPages,
        results,
      });
    });
  });
});


router.get('/articles/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Article WHERE article_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

//JSON format me data bhejna h
router.post('/articles', (req, res) => {
  const { article_id, title, content, published_date, likes, number_of_comments, number_of_views, category_id } = req.body;
  const query = 'INSERT INTO Article (article_id, title, content, published_date, likes, number_of_comments, number_of_views, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [article_id, title, content, published_date, likes, number_of_comments, number_of_views, category_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Article created', articleId: result.insertId });
  });
});

//JSON format me data bhejna h
router.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query('UPDATE Article SET title = ?, content = ? WHERE article_id = ?', [title, content, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Article updated' });
  });
});


router.delete('/articles/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Article WHERE article_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Article deleted' });
  });
});


// ---------------------- Category Routes ----------------------
router.get('/categories', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate that page and limit are positive integers
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive integers' });
  }

  const offset = (page - 1) * limit;

  // Get total count of categories
  const countQuery = 'SELECT COUNT(*) AS total FROM Category';
  db.query(countQuery, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to count categories' });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated categories
    const query = 'SELECT * FROM Category LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve categories' });
      }

      // Return the paginated data along with the total count and total pages
      res.json({
        page,
        limit,
        total,
        totalPages,
        results,
      });
    });
  });
});

router.get('/categories/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Category WHERE category_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/categories', (req, res) => {
  const { category_id, category_name } = req.body;
  const query = 'INSERT INTO Category (category_id, category_name) VALUES (?, ?)';
  db.query(query, [category_id, category_name], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  });
});

router.put('/categories/:id', (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  db.query('UPDATE Category SET category_name = ? WHERE category_id = ?', [category_name, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Category updated' });
  });
});

router.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Category WHERE category_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Category deleted' });
  });
});

// ---------------------- Comments Routes ----------------------
router.get('/comments', (req, res) => {
  db.query('SELECT * FROM Comments', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Comments WHERE comment_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/comments', (req, res) => {
  const { comment_id, date_posted, content, number_of_likes, number_of_replies, user_id, article_id } = req.body;
  const query = 'INSERT INTO Comments (comment_id, date_posted, content, number_of_likes, number_of_replies, user_id, article_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [comment_id, date_posted, content, number_of_likes, number_of_replies, user_id, article_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Comment created', commentId: result.insertId });
  });
});

router.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.query('UPDATE Comments SET content = ? WHERE comment_id = ?', [content, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Comment updated' });
  });
});

router.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Comments WHERE comment_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Comment deleted' });
  });
});

// ---------------------- Contains-Comments Routes ----------------------
router.post('/contains_comments', (req, res) => {
  const { article_id, comment_id } = req.body;
  const query = 'INSERT INTO Contains_comments (article_id, comment_id) VALUES (?, ?)';
  
  db.query(query, [article_id, comment_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add comment to article' });
    }
    res.status(201).json({ message: 'Comment added to article successfully', result });
  });
});

router.get('/contains_comments/article/:article_id', (req, res) => {
  const { article_id } = req.params;
  const query = `
    SELECT c.comment_id, c.content, c.date_posted
    FROM Contains_comments cc
    JOIN Comments c ON cc.comment_id = c.comment_id
    WHERE cc.article_id = ?`;

  db.query(query, [article_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve comments for article' });
    }
    res.json(results);
  });
});

router.get('/contains_comments/comment/:comment_id', (req, res) => {
  const { comment_id } = req.params;
  const query = `
    SELECT a.article_id, a.title
    FROM Contains_comments cc
    JOIN Article a ON cc.article_id = a.article_id
    WHERE cc.comment_id = ?`;

  db.query(query, [comment_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve articles for comment' });
    }
    res.json(results);
  });
});

router.put('/contains_comments', (req, res) => {
  const { article_id, comment_id } = req.body;
  const query = `
    UPDATE Contains_comments
    SET article_id = ?, comment_id = ?
    WHERE article_id = ? AND comment_id = ?`;

  db.query(query, [article_id, comment_id, article_id, comment_id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update comment-article association' });
    }
    res.json({ message: 'Comment-Article association updated successfully' });
  });
});

router.delete('/contains_comments', (req, res) => {
  const { article_id, comment_id } = req.body;
  const query = 'DELETE FROM Contains_comments WHERE article_id = ? AND comment_id = ?';

  db.query(query, [article_id, comment_id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove comment from article' });
    }
    res.json({ message: 'Comment removed from article successfully' });
  });
});

router.delete('/contains_comments/article/:article_id', (req, res) => {
  const { article_id } = req.params;
  const query = 'DELETE FROM Contains_comments WHERE article_id = ?';

  db.query(query, [article_id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove all comments from article' });
    }
    res.json({ message: 'All comments removed from article successfully' });
  });
});

router.delete('/contains_comments/comment/:comment_id', (req, res) => {
  const { comment_id } = req.params;
  const query = 'DELETE FROM Contains_comments WHERE comment_id = ?';

  db.query(query, [comment_id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove comment from all articles' });
    }
    res.json({ message: 'Comment removed from all articles successfully' });
  });
});

// ---------------------- User Routes ----------------------
router.get('/users', (req, res) => {
  db.query('SELECT * FROM User', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM User WHERE user_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/users', (req, res) => {
  const { user_id, plan_id, name, email, pin, city, state, country } = req.body;
  const query = 'INSERT INTO User (user_id, plan_id, name, email, pin, city, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [user_id, plan_id, name, email, pin, city, state, country], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
});

router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, pin, city, state, country } = req.body;
  db.query('UPDATE User SET name = ?, email = ?, pin = ?, city = ?, state = ?, country = ? WHERE user_id = ?', 
    [name, email, pin, city, state, country, id], (err) => {
    if (err) throw err;
    res.json({ message: 'User updated' });
  });
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM User WHERE user_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'User deleted' });
  });
});


// ---------------------- Write_article Routes ----------------------
router.get('/write_articles', (req, res) => {
  db.query('SELECT * FROM Write_article', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/write_articles/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Write_article WHERE article_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/write_articles', (req, res) => {
  const { article_id, journalist_id } = req.body;
  db.query('INSERT INTO Write_article (article_id, journalist_id) VALUES (?, ?)', 
    [article_id, journalist_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Write article created', writeArticleId: result.insertId });
  });
});

router.put('/write_articles/:id', (req, res) => {
  const { id } = req.params;
  const { journalist_id } = req.body;
  db.query('UPDATE Write_article SET journalist_id = ? WHERE article_id = ?', 
    [journalist_id, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Write article updated' });
  });
});

router.delete('/write_articles/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Write_article WHERE article_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Write article deleted' });
  });
});

// ---------------------- Editor Routes ----------------------
router.get('/editors', (req, res) => {
  db.query('SELECT * FROM Editor', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/editors/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Editor WHERE editor_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/editors', (req, res) => {
  const { editor_id, name, email, department_name } = req.body;
  db.query('INSERT INTO Editor (editor_id, name, email, department_name) VALUES (?, ?, ?, ?)', 
    [editor_id, name, email, department_name], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Editor created', editorId: result.insertId });
  });
});

router.put('/editors/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, department_name } = req.body;
  db.query('UPDATE Editor SET name = ?, email = ?, department_name = ? WHERE editor_id = ?', 
    [name, email, department_name, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Editor updated' });
  });
});

router.delete('/editors/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Editor WHERE editor_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Editor deleted' });
  });
});

// ---------------------- Journalists Routes ----------------------
router.get('/journalists', (req, res) => {
  db.query('SELECT * FROM Journalist', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/journalists/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Journalist WHERE journalist_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/journalists', (req, res) => {
  const { journalist_id, name, joining_date, department, role, article_name, email } = req.body;
  db.query('INSERT INTO Journalist (journalist_id, name, joining_date, department, role, article_name, email) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [journalist_id, name, joining_date, department, role, article_name, email], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Journalist created', journalistId: result.insertId });
  });
});

router.put('/journalists/:id', (req, res) => {
  const { id } = req.params;
  const { name, joining_date, department, role, article_name, email } = req.body;
  db.query('UPDATE Journalist SET name = ?, joining_date = ?, department = ?, role = ?, article_name = ?, email = ? WHERE journalist_id = ?', 
    [name, joining_date, department, role, article_name, email, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Journalist updated' });
  });
});

router.delete('/journalists/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Journalist WHERE journalist_id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Journalist deleted' });
  });
});

// ---------------------- Read-Articles Routes ----------------------
router.get('/read-articles', (req, res) => {
  db.query('SELECT * FROM Read_article', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/read-articles/:article_id/:user_id', (req, res) => {
  const { article_id, user_id } = req.params;
  db.query('SELECT * FROM Read_article WHERE article_id = ? AND user_id = ?', [article_id, user_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/read-articles', (req, res) => {
  const { article_id, user_id } = req.body;
  db.query('INSERT INTO Read_article (article_id, user_id) VALUES (?, ?)', 
    [article_id, user_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Read_article record created', recordId: result.insertId });
  });
});

router.put('/read-articles/:article_id/:user_id', (req, res) => {
  const { article_id, user_id } = req.params;
  const { new_article_id, new_user_id } = req.body;  // Assuming we want to update the article_id or user_id
  db.query('UPDATE Read_article SET article_id = ?, user_id = ? WHERE article_id = ? AND user_id = ?', 
    [new_article_id, new_user_id, article_id, user_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Read_article record updated' });
  });
});

router.delete('/read-articles/:article_id/:user_id', (req, res) => {
  const { article_id, user_id } = req.params;
  db.query('DELETE FROM Read_article WHERE article_id = ? AND user_id = ?', [article_id, user_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Read_article record deleted' });
  });
});

// ---------------------- Review-Articles Routes ----------------------
router.get('/review-articles', (req, res) => {
  db.query('SELECT * FROM Review_article', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/review-articles/:editor_id/:article_id', (req, res) => {
  const { editor_id, article_id } = req.params;
  db.query('SELECT * FROM Review_article WHERE editor_id = ? AND article_id = ?', [editor_id, article_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/review-articles', (req, res) => {
  const { editor_id, article_id } = req.body;
  db.query('INSERT INTO Review_article (editor_id, article_id) VALUES (?, ?)', 
    [editor_id, article_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Review_article record created', recordId: result.insertId });
  });
});

router.put('/review-articles/:editor_id/:article_id', (req, res) => {
  const { editor_id, article_id } = req.params;
  const { new_editor_id, new_article_id } = req.body; // Assuming we want to update the editor_id or article_id
  db.query('UPDATE Review_article SET editor_id = ?, article_id = ? WHERE editor_id = ? AND article_id = ?', 
    [new_editor_id, new_article_id, editor_id, article_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Review_article record updated' });
  });
});

router.delete('/review-articles/:editor_id/:article_id', (req, res) => {
  const { editor_id, article_id } = req.params;
  db.query('DELETE FROM Review_article WHERE editor_id = ? AND article_id = ?', [editor_id, article_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Review_article record deleted' });
  });
});


// ---------------------- Subscription Plan Routes ----------------------
router.get('/subscription-plans', (req, res) => {
  db.query('SELECT * FROM Subscription_Plan', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/subscription-plans/:plan_id', (req, res) => {
  const { plan_id } = req.params;
  db.query('SELECT * FROM Subscription_Plan WHERE plan_id = ?', [plan_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/subscription-plans', (req, res) => {
  const { plan_id, plan_name, cost, duration } = req.body;
  db.query('INSERT INTO Subscription_Plan (plan_id, plan_name, cost, duration) VALUES (?, ?, ?, ?)', 
    [plan_id, plan_name, cost, duration], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Subscription Plan created', planId: result.insertId });
  });
});

router.put('/subscription-plans/:plan_id', (req, res) => {
  const { plan_id } = req.params;
  const { plan_name, cost, duration } = req.body;
  db.query('UPDATE Subscription_Plan SET plan_name = ?, cost = ?, duration = ? WHERE plan_id = ?', 
    [plan_name, cost, duration, plan_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Subscription Plan updated' });
  });
});

router.delete('/subscription-plans/:plan_id', (req, res) => {
  const { plan_id } = req.params;
  db.query('DELETE FROM Subscription_Plan WHERE plan_id = ?', [plan_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Subscription Plan deleted' });
  });
});

// ---------------------- User-Favorite-Topic Routes ----------------------
router.get('/user-favorite-topics', (req, res) => {
  db.query('SELECT * FROM UserFavoriteTopics', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/user-favorite-topics/:user_id/:topic_name', (req, res) => {
  const { user_id, topic_name } = req.params;
  db.query('SELECT * FROM UserFavoriteTopics WHERE user_id = ? AND topic_name = ?', 
    [user_id, topic_name], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/user-favorite-topics', (req, res) => {
  const { user_id, topic_name } = req.body;
  db.query('INSERT INTO UserFavoriteTopics (user_id, topic_name) VALUES (?, ?)', 
    [user_id, topic_name], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'User favorite topic created', userId: user_id, topicName: topic_name });
  });
});

router.delete('/user-favorite-topics/:user_id/:topic_name', (req, res) => {
  const { user_id, topic_name } = req.params;
  db.query('DELETE FROM UserFavoriteTopics WHERE user_id = ? AND topic_name = ?', 
    [user_id, topic_name], (err) => {
    if (err) throw err;
    res.json({ message: 'User favorite topic deleted' });
  });
});

// ---------------------- Write-Article Routes ----------------------
router.get('/write-article', (req, res) => {
  db.query('SELECT * FROM Write_article', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/write-article/:article_id/:journalist_id', (req, res) => {
  const { article_id, journalist_id } = req.params;
  db.query('SELECT * FROM Write_article WHERE article_id = ? AND journalist_id = ?', 
    [article_id, journalist_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/write-article', (req, res) => {
  const { article_id, journalist_id } = req.body;
  db.query('INSERT INTO Write_article (article_id, journalist_id) VALUES (?, ?)', 
    [article_id, journalist_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Article written by journalist', articleId: article_id, journalistId: journalist_id });
  });
});

router.delete('/write-article/:article_id/:journalist_id', (req, res) => {
  const { article_id, journalist_id } = req.params;
  db.query('DELETE FROM Write_article WHERE article_id = ? AND journalist_id = ?', 
    [article_id, journalist_id], (err) => {
    if (err) throw err;
    res.json({ message: 'Journalist removed from article' });
  });
});

// ---------------------- Write-Comments Routes ----------------------
router.get('/write-comment', (req, res) => {
  db.query('SELECT * FROM Write_comment', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/write-comment/:user_id/:comment_id', (req, res) => {
  const { user_id, comment_id } = req.params;
  db.query('SELECT * FROM Write_comment WHERE user_id = ? AND comment_id = ?', 
    [user_id, comment_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

router.post('/write-comment', (req, res) => {
  const { user_id, comment_id } = req.body;
  db.query('INSERT INTO Write_comment (user_id, comment_id) VALUES (?, ?)', 
    [user_id, comment_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Comment written by user', userId: user_id, commentId: comment_id });
  });
});

router.delete('/write-comment/:user_id/:comment_id', (req, res) => {
  const { user_id, comment_id } = req.params;
  db.query('DELETE FROM Write_comment WHERE user_id = ? AND comment_id = ?', 
    [user_id, comment_id], (err) => {
    if (err) throw err;
    res.json({ message: 'User removed from comment' });
  });
});


module.exports = router;