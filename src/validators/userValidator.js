import * as yup from 'yup';

class UserValidator {
  async create(req, res, next) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        message: 'O conteúdo recebido é inválido.',
      });
    }
    return next();
  }

  async update(req, res, next) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      password: yup
        .string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: yup
        .string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        message: 'O conteúdo recebido é inválido.',
      });
    }
    return next();
  }

  async login(req, res, next) {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        message: 'O conteúdo recebido é inválido.',
      });
    }
    return next();
  }
}

export default new UserValidator();
