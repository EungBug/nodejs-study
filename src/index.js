import express from 'express';

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Node.js")
})

app.listen(8000, () => {
  console.log("서버가 시작되었습니다.");
})