import { Router } from 'express';
// 라우터 생성
class UserController {
  router;

  users = [
    {
      id: 1,
      name: 'Eun bi',
      age: 18
    }
  ];

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getUsers.bind(this));
    this.router.get('/detail/:id', this.getUser.bind(this));
    this.router.post('/', this.createUser.bind(this));
  }

  // 전체 유저 조회
  getUsers(req, res) {
    res.status(200).json({ users: this.users });
  }

  // 유저 정보 상세 조회
  getUser(req, res) {
    const { id } = req.params;
    const user = this.users.find(user => user.id === Number(id));

    res.status(200).json({ user });
  }

  // 유저 생성
  createUser(req, res) {
    const { name, age } = req.body;
    this.users.push({
      id: new Date().getTime(),
      name,
      age
    });

    res.status(201).json({ users: this.users });
  }
}

const userController = new UserController();
export default userController;