import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../configuration/db';
import User from '../models/user';
import Image from '../models/image';
import Appointment from '../models/appointment';

const models = [User, Image, Appointment];

class Database {
  constructor(freeQuery = false) {
    this.init(freeQuery);
    this.mongo();
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

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb+srv://lfnjunior-barber:Sn5d2dANbtBRO2Wl@lfnjunior-barber-h5ljk.gcp.mongodb.net/barber?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
