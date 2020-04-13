import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/appointment';
import User from '../models/user';
import Image from '../models/image';
import Notification from '../schemas/notificacion';

import CancellationMail from '../jobs/cancellationMail';
import Queue from '../lib/queue';

class AppointmentController {
  async create(req, res) {
    const { provider_id, date } = req.body;

    /**
     * É um prestador de serviço?
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        message: 'Não foi informado um prestador de serviços válido!',
      });
    }

    /**
     * É uma data/hora futura?
     */

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        message: 'Deve ser uma data/hora futura!',
      });
    }

    /**
     * está disponível?
     */

    const notAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (notAvailable) {
      return res.status(400).json({
        message: 'Data/hora não está disponível para agendamento!',
      });
    }

    /**
     * Cadastra agendamento
     */

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notificação de agendamento para o prestador
     */
    const user = await User.findByPk(req.userId, {
      attributes: ['name'],
    });

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json({
      message: 'Agendamento realizado com sucesso!',
      appointment,
    });
  }

  async search(req, res) {
    return res.json({});
  }

  async list(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: Image,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }

  async update(req, res) {
    return res.json({});
  }

  // eslint-disable-next-line consistent-return
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['name', 'email'] },
        { model: User, as: 'user', attributes: ['name', 'email'] },
      ],
    });

    /**
     * Usuário que está cancelando é o mesmo usuário que realizou o angendamento?
     */

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        message: 'O usuário não está autorizado a cancelar esse agendamento!',
      });
    }

    /**
     * Está cancelando com pelo menos 2 horas de antecedência?
     */

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        message:
          'Só é possível cancelar um agendamento com pelo menos 2 horas de antecedência!',
      });
    }

    /**
     * Realiza o cancelamento
     */

    appointment.canceled_at = new Date();

    await appointment.save();

    /**
     * Notifica o prestador de serviço que o agendamento foi cancelado
     */

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json({
      message: 'Agendamento cancelado!',
      appointment,
    });
  }
}

export default new AppointmentController();
