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
    db.query("DELETE FROM topics;");
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual([]);
      });
  });

  test("404: Responds with an error", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object of all articles sorted by created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles).toBeSortedBy("created_at", { descending: false });

        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("200: Responds with an empty array", () => {
    db.query("DELETE FROM articles;");
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("404: Responds with an error", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of article by id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: "2020-06-06T09:10:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Responds with an error of bad request", () => {
    return request(app)
      .get("/api/articles/person")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Responds with an error which id no exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object of all articles sorted by created_at", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
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

  test("200: Responds with empty array of no comment found on existing article", () => {
    db.query("DELETE FROM comments;");
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("404: Responds with an error", () => {
    return request(app)
      .get("/api/articles/4/comment")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });

  test("404: Responds with an error which article id no exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object of new comment", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: "butter_bridge", body: "I love streaming noses" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.article_id).toBe(4);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.comment_id).toBe(19);
        expect(comment.votes).toBe(0);
        expect(comment.body).toBe("I love streaming noses");
        expect(typeof comment.created_at).toBe("string");
      });
  });

  test("400: Responds with error of bad request", () => {
    db.query("DELETE FROM comments;");
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: 1234, body: 12345 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Database request failed");
      });
  });

  test("404: Responds with an error", () => {
    return request(app)
      .post("/api/articles/4/comment")
      .send({ username: "butter_bridge", body: "Testing" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Page Not Found");
      });
  });

  // test("404: Responds with an error which article id no exist", () => {
  //   return request(app)
  //     .get("/api/articles/999/comments")
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("No article Found");
  //     });
  // });
});
