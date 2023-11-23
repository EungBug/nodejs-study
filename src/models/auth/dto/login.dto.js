import bcrypt from 'bcrypt';

export class LoginDTO {
  email;
  password;

  constructor(props) {
    this.email = props.email;
    this.password = props.password;
  }

  async comparePassword(password) {
    // 첫번째 인자 : 암호화 되지 않은 pw, 두번째 인자 : 암호화 된 pw
    const isCorrect = await bcrypt.compare(this.password, password);
    return isCorrect;
  }
}
