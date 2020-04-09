import User from '../models/user';

class UserController {
  async create(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({
        message: 'Já existe um usuário com essa conta de email.',
      });
    }
    const user = await User.create(req.body);
    return res.json(user);
  }

  async list(req, res) {
    return res.json({});
  }

  async search(req, res) {
    return res.json({});
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({
          message: 'Já existe um usuário com essa conta de email.',
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        message: 'Senha inválida.',
      });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new UserController();
