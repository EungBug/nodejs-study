import { UserService } from '../../users/service';
import { CreateUserDTO } from '../../users/dto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  userService;

  constructor() {
    this.userService = new UserService();
  }

  async register(props) {
    const isExist = await this.userService.checkUserByEmail(props.email);

    if (isExist) throw { status: 400, message: '이미 존재하는 이메일입니다.' };

    const newUserId = await this.userService.createUser(
      new CreateUserDTO({
        ...props,
        password: await props.hashPassword(),
      })
    );

    // 액세스 토큰 생성
    const accessToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
      expiresIn: '14d',
    });

    console.log(accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  // props : LoginDTO
  async login(props) {
    const isExist = await this.userService.checkUserByEmail(props.email);
    if (!isExist) throw { status: 404, message: '존재하지 않는 유저입니다.' };

    const isCorrect = await props.comparePassword(isExist.password);

    if (!isCorrect) throw { status: 400, message: '이메일 또는 비밀번호를 확인해주세요.' };

    // 액세스 토큰 생성
    const accessToken = jwt.sign({ id: isExist.id }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign({ id: isExist.id }, process.env.JWT_KEY, {
      expiresIn: '14d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(accessToken, refreshToken) {
    const accessToeknPayload = jwt.verify(accessToken, process.env.JWT_KEY, {
      ignoreExpiration: true, // 만료되어도 신경쓰지 않겠다.
    });
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.JWT_KEY);

    if (accessToeknPayload.id !== refreshTokenPayload.id) {
      throw { status: 403, message: '권한이 없습니다.' };
    }

    const user = await this.userService.findUserById(accessToeknPayload.id);

    // 토큰 재발행
    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: '14d',
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
