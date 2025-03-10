const app = require("./app");

const port = 3000;

app.listen(port, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.log(`Listening on port ${port}`);
  }
});
