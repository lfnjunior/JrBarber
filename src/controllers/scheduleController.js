import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/user';
import Appointment from '../models/appointment';

class ScheduleController {
  async search(req, res) {
    /**
     * É um prestadorde serviço?
     */
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        message: 'Não foi informado um prestador de serviços válido!',
      });
    }

    const { date } = req.query;
    const isoDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(isoDate), endOfDay(isoDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
