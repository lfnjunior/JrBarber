import Appointment from '../models/appointments';

class AppointmentController {
  async create(req, res) {
    return res.json({
      message: 'Agendamento realizado com sucesso!',
    });
  }

  async search(req, res) {
    return res.json({});
  }

  async list(req, res) {
    const ap = await Appointment.findAll();
    return res.json(ap);
  }

  async update(req, res) {
    return res.json({});
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new AppointmentController();
