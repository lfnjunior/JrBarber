import jwt from 'jsonwebtoken';
import authConfig from '../configuration/auth';
import User from '../models/user';

class LoginController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'Usuário não cadastrado.',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        message: 'Senha inválida.',
      });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new LoginController();
