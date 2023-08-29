const defaultSwagger = {
  openapi: '3.1.0',
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'dev',
      variables: {}
    }
  ],
  info: {
    // package.json version과 동일하게 맞춘다.
    version: '1.0.0',
    title: 'Swagger Node.js study',
    description: 'Node.js 스터디 및 스웨거 연습'
  }
};

export default defaultSwagger;
