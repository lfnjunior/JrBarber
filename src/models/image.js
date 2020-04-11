import Sequelize, { Model } from 'sequelize';

class Image extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `https://storage.googleapis.com/images-lfnjunior/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default Image;
