import * as yup from 'yup';

// Docs:
// https://github.com/jquense/yup
class AppointmentValidator {
  async create(req, res, next) {
    const schema = yup.object().shape({
      date: yup
        .date()
        .typeError('Deve ser uma válida!')
        .required('Não foi informado qual é a data da prestação do serviço!'),
      provider_id: yup
        .number()
        .typeError('Deve ser um número válido!')
        .min(1, 'Id do prestador deve ser um número maior ou igual à 1!')
        .required('Não foi informado qual é o prestador de serviço!'),
    });
    schema
      .validate(req.body)
      .then(() => {
        return next();
      })
      .catch((err) => {
        return res.status(401).json({
          message: err.message,
        });
      });
  }

  async update(req, res, next) {
    return next();
  }
}

export default new AppointmentValidator();
