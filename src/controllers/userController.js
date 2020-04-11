import User from '../models/user';

class UserController {
  async create(req, res) {
    const userExists = await User.findOne({
      where: { email: req.body.email },
      attributes: ['id'],
    });
    if (userExists) {
      return res.status(400).json({
        message: 'Já existe um usuário com essa conta de email.',
      });
    }
    const { id, name, email } = await User.create(req.body);
    return res.json({
      message: 'Usuário cadastrado com sucesso!',
      user: { id, name, email },
    });
  }

  async list(req, res) {
    return res.json(
      await User.findAll({
        attributes: [
          'id',
          'name',
          'email',
          'provider',
          'createdAt',
          'updatedAt',
        ],
      })
    );
  }

  async search(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'provider', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado!',
      });
    }
    return res.json(user);
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

    const userUpdt = await user.update(req.body);

    return res.json(userUpdt);
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'provider', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado!',
      });
    }
    const result = await user.destroy();
    return res.json(result);
  }
}

export default new UserController();
