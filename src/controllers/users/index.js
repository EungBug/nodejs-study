import { Router } from 'express';
import { UserDTO, CreateUserDTO } from './dto';

// 라우터 생성
class UserController {
  router;
  path = '/users';
  users = [
    {
      id: 1,
      firstName: 'Lee',
      lastName: 'Eun bi',
      age: 18
    }
  ];

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getUsers.bind(this));
    this.router.get('/detail/:id/fullName', this.getUserFullName.bind(this));
    this.router.get('/detail/:id', this.getUser.bind(this));
    this.router.post('/', this.createUser.bind(this));
  }

  // 전체 유저 조회
  getUsers(req, res, next) {
    try {
      const users = this.users.map(user => new UserDTO(user));
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }

  // 유저 정보 상세 조회
  getUser(req, res, next) {
    try {
      const { id } = req.params;
      const targetUser = this.users.find(user => user.id === Number(id));

      if (!targetUser) {
        throw { status: 404, message: '유저를 찾을 수 없습니다.' };
      }
      const user = new UserDTO(targetUser);

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  // DTO를 사용하는 경우 DTO에 정의한 함수를 사용할 수 있다.
  getUserFullName(req, res, next) {
    try {
      const { id } = req.params;
      const targetUser = this.users.find(user => user.id === Number(id));

      if (!targetUser) {
        throw { status: 404, message: '유저를 찾을 수 없습니다.' };
      }

      const user = new UserDTO(targetUser);

      res.status(200).json({ fullName: user.fullName() });
    } catch (error) {
      next(error);
    }
  }

  // 유저 생성
  createUser(req, res, next) {
    try {
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName) {
        throw { status: 400, message: '이름이 없습니다.' };
      }

      const newUser = new CreateUserDTO(firstName, lastName, age).getNewUser;

      this.users.push(newUser);

      res.status(201).json({ users: this.users });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;
