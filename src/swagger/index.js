import { Swaggers } from '../models';
import defaultSwagger from './defaultSwager';

// path 가공
const { paths } = Object.values(Swaggers).reduce(
  (acc, apis) => {
    const APIs = Object.values(apis).map(api => {
      console.log('api:', api);
      return { ...api };
    });
    APIs.forEach(api => {
      const key = Object.keys(api)[0];
      if (!acc.paths[key]) {
        acc.paths = {
          ...acc.paths,
          ...api,
        };
      } else {
        acc.paths[key] = {
          ...acc.paths[key],
          ...api[key],
        };
      }
    });
    return acc;
  },
  { paths: {} }
);

// Swagger에 등록할 json 생성 = defaultSwagger + 가공한 path
export const swaggerDocs = {
  ...defaultSwagger,
  // paths 등록
  paths,
};

// Swagger에 등록하기
export const options = {
  swaggerOptions: {
    url: '/swagger.json',
  },
};
