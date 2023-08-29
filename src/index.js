import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Controllers from './controllers';
import { swaggerDocs, options } from './swagger';
import swaggerUiExpress from 'swagger-ui-express';

// express 앱 생성
const app = express();

// 미들웨어
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '700mb' }));

// 유저 라우터 등록
Controllers.forEach(controller => {
  app.use(controller.path, controller.router);
});

// 에러 미들웨어 - 공통 에러 핸들링
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || '서버에서 에러가 발생했습니다.' });
});

app.get('/swagger.json', (req, res) => {
  res.status(200).json(swaggerDocs);
});
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(undefined, options));

/*
// GET - 유저 조회
// query or path
// 성공 status : 200
app.get('/users', (req, res) => {
  res.status(200).json({ users });
});

// POST - 유저 생성
// 요청 -> body
// 성공 status : 201
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  users.push({
    id: new Date().getTime(),
    name,
    age
  });

  res.status(201).json({ users });
});

// PATCH - 유저 정보 수정
// :id : path variable => req.params.id
// 성공 status : 204
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const targetUserIndex = users.findIndex(user => user.id === Number(id));
  users[targetUserIndex] = {
    id: users[targetUserIndex].id,
    name: name ?? users[targetUserIndex].name,
    age: age ?? users[targetUserIndex].age
  };

  res.status(204).json({});
});

// DELETE - 유저 삭제
// 성공 status: 204
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const deletedUsers = users.filter(user => user.id !== Number(id));
  users = deletedUsers;
  res.status(204).json({});
});
*/

// express 앱 실행하기
app.listen(8000, () => {
  console.log('서버가 시작되었습니다.');
});
