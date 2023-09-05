import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Controllers from './controllers';
import { swaggerDocs, options } from './swagger';
import swaggerUiExpress from 'swagger-ui-express';
import database from './database';

(async () => {
  // express 앱 생성
  const app = express();

  // DB 연결
  await database.$connect();

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

  // express 앱 실행하기
  app.listen(8000, () => {
    console.log('서버가 시작되었습니다.');
  });
})();
