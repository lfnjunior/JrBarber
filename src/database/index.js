import Sequelize from 'sequelize';
import databaseConfig from '../configuration/db';
import User from '../models/user';
import Image from '../models/image';
import Appointment from '../models/appointments';

const models = [User, Image, Appointment];

class Database {
  constructor(freeQuery = false) {
    this.init(freeQuery);
  }

  init(freeQuery) {
    this.connection = new Sequelize(databaseConfig);
    if (!freeQuery) {
      models.map((model) => model.init(this.connection));
      models.map(
        (model) => model.associate && model.associate(this.connection.models)
      );
    }
  }
}

export default new Database();
