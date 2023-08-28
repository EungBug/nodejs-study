import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

app.use(
  cors({
    // 특정 도메인으로 요청이 와야지만 허용
    origin: 'https://www.google.com'
  })
);
app.use(helmet());

const today = new Date();
const todayjs = dayjs(today).format('YYYY-MM-DD');
console.log(`today: ${todayjs}`);

// bcrypt
const password = '1234';
const hashedPassword = bcrypt.hashSync(password, 10); // 암호화 된 패스워드 생성
console.log(hashedPassword);

// jwt
const token = jwt.sign('1234', 'aasdfewrfdsa');

console.log(token);

app.get('/', (req, res) => {
  res.send('Hello, Node.js');
});

app.listen(8000, () => {
  console.log('서버가 시작되었습니다.');
});
