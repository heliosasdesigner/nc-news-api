const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
} = require("../db/seeds/seeding-func");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.img_url).toBe("string");
        });
      });
  });

  test("200: Responds with an empty array with no topics found", () => {
    return db.query("DELETE FROM topics;").then(() => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual([]);
        });
    });
  });

  test("404: Passed incorrect endpoint and responds with an error", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("POST /api/topics/", () => {
  test("201: Responds with the posted topic of new topic", () => {
    return request(app)
      .post("/api/topics/")
      .send({
        slug: "games",
        description: "the games should play once",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic.slug).toBe("games");
      });
  });

  test("400: Passed invalid body to update and respond with error of bad request", () => {
    return request(app)
      .post("/api/topics/")
      .send({
        abe: "games",
        edf: "the games should play once",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object of all articles sorted by created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);

        expect(articles).toBeSortedBy("created_at", { descending: false });

        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.total_count).toBe("number");
          expect(typeof article.comment_count).toBe("number");
          expect(article.total_count).toBe(13);
        });
      });
  });

  test("200: Responds with an object of all articles sorted by votes in desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: Responds with an object of all articles sorted by comment_count in desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: Responds with an object of all articles which topic is cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("200: Responds with an object of no articles which topic is no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });

  test("200: Responds with an object of no articles which topic is some random string", () => {
    return request(app)
      .get("/api/articles?topic=random")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });

  test("200: Responds with an empty array", () => {
    return db.query("DELETE FROM articles;").then(() => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toEqual([]);
        });
    });
  });

  test("200: Passed invalid queries and responds with an object of all articles sorted by default value : created_at in asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=abcd&order=upward")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("200: Responds with an object of limit(3) number articles in p(1) page", () => {
    return request(app)
      .get("/api/articles?limit=3&p=1")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
      });
  });

  test("200: Responds with an object of limit(3) number articles in p(2) page", () => {
    return request(app)
      .get("/api/articles?limit=3&p=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
      });
  });

  test("200: Responds with an object of limit(3) number articles in p(3) page", () => {
    return request(app)
      .get("/api/articles?limit=3&p=3")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
      });
  });

  test("404: Passed incorrect endpoint and responds with an error", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("POST /api/articles/", () => {
  test("201: Responds with the posted article of new article in the case the topic exists", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        title: "This is new article for testing",
        topic: "cats",
        author: "paul",
        body: "this is body for testing",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(14);

        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(0);
      });
  });

  test("201: Responds with the posted article of new article in the case the topic no exists", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        title: "This is new article for testing",
        topic: "dogs",
        author: "paul",
        body: "this is body for testing with topic is dog",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(14);

        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(0);
      });
  });

  test("400: Passed invalid body to update and respond with error of bad request", () => {
    return request(app)
      .post("/api/articles/")
      .send({ abc: 1234, def: 12345 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of article by id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });

  test("400: Passed invalid user ID and responds with an error of bad request", () => {
    return request(app)
      .get("/api/articles/person")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Passed not exists user ID and responds with an error", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: Responds with no content", () => {
    return request(app)
      .delete("/api/articles/4")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM articles WHERE article_id = 4`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  test("404: Passed not exists comment ID and responds with error of Comment Not Found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object of all articles sorted by created_at", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");

          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test("200: Responds with comment of number limit by (1) found on existing article", () => {
    return request(app)
      .get("/api/articles/4/comments?limit=1&p2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(1);
      });
  });

  test("200: Responds with empty array of no comment found on existing article", () => {
    return db.query("DELETE FROM comments;").then(() => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
  });

  test("404: Passed incorrect endpoint and responds with an error", () => {
    return request(app)
      .get("/api/articles/4/comment")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });

  test("404: Passed not exists user ID and responds with an error", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment of new comment", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: "butter_bridge", body: "I love streaming noses" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toBe("I love streaming noses");
      });
  });

  test("400: Passed invalid username and responds with error of bad request", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: 1234, body: 12345 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Passed incorrect endpoint and responds with an error", () => {
    return request(app)
      .post("/api/articles/4/comment")
      .send({ username: "butter_bridge", body: "Testing" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("202: Responds with a vote (+100) updated object of article by id", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 100 })
      .expect(202)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("votes", 100);
      });
  });

  test("202: Responds with a vote (-1000) updated object of article by id", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -1000 })
      .expect(202)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("votes", -1000);
      });
  });

  test("400: Passed invalid value and responds with an error of bad request ", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "ABCD" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("400: Passed invalid key and responds with an error of bad request ", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ ABC: 123 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Passed not exists article ID and responds with an error", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("202: Responds with a vote (+100) updated object of comment by id", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: 100 })
      .expect(202)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("votes", 100);
      });
  });

  test("202: Responds with a vote (-1000) updated object of comment by id", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: -1000 })
      .expect(202)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("votes", -1000);
      });
  });

  test("400: Passed invalid value in comment endpoint and responds with an error of bad request ", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "ABCD" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("400: Passed invalid key in the request body to update comment vote and responds with an error of bad request ", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ ABC: 123 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Passed not exists article ID and responds with an error", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 4`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  test("404: Passed not exists comment ID and responds with error of Comment Not Found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment Not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });

  test("200: Responds with an empty array with no users found", () => {
    return db.query("DELETE FROM users;").then(() => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toEqual([]);
        });
    });
  });

  test("404: Passed incorrect endpoint and responds with an error", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with an object of users by username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("404: Passed not exists user ID and responds with an error", () => {
    return request(app)
      .get("/api/users/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No User Found");
      });
  });
});
