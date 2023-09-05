import { Router } from 'express';
import { UserService } from '../service';
import { pagination } from '../../middleware/paginations';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../dto';

// 라우터 생성
class UserController {
  router;
  path = '/users';
  userService;

  constructor() {
    this.router = Router();
    this.userService = new UserService();
    this.init();
  }

  init() {
    this.router.get('/', pagination, this.getUsers.bind(this));
    this.router.get('/detail/:id', this.getUser.bind(this));
    this.router.post('/', this.createUser.bind(this));
    this.router.post('/:id', this.updateUser.bind(this));
    this.router.post('/:id', this.deleteUser.bind(this));
  }

  // 전체 유저 조회
  async getUsers(req, res, next) {
    try {
      const { users, count } = await this.userService.findUsers({
        skip: req.skip,
        take: req.take,
      });

      res.status(200).json({ users: users.map(user => new UserDTO(user)), count });
    } catch (error) {
      next(error);
    }
  }

  // 유저 정보 상세 조회
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.findUserById(id);

      res.status(200).send({ user: new UserDTO(user) });
    } catch (error) {
      next(error);
    }
  }

  // 유저 생성
  async createUser(req, res, next) {
    try {
      const createUserDto = new CreateUserDTO(req.body);
      const newUserId = await this.userService.createUser(createUserDto);

      res.status(201).json({ id: newUserId });
    } catch (error) {
      next(error);
    }
  }

  // 유저 수정
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateUserDto = new UpdateUserDTO(req.body);

      await this.userService.updateUser(id, updateUserDto);

      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  // 유저 삭제
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);

      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;
