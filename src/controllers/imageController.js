import { resolve } from 'path';
import fs from 'fs';
import bucket from '../configuration/storage';
import Image from '../models/image';
import User from '../models/user';

// https://www.npmjs.com/package/@google-cloud/storage
class ImageController {
  async create(req, res) {
    if (!req.file) {
      return res.status(400).json({
        message: 'Nenhuma imagem foi fornecida',
      });
    }

    const { originalname, filename } = req.file;
    const tmpPath = resolve(__dirname, '..', 'tmp', 'uploads');
    const path = `${tmpPath}/${filename}`;
    const config = {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };
    await bucket.upload(path, config);
    await bucket.file(filename).makePublic();
    fs.unlinkSync(path);
    const { id: id_image } = await Image.create({
      name: originalname,
      path: filename,
    });

    // vincular a imagem ao usuário
    console.log(req.userId);
    const user = await User.findByPk(req.userId);
    const result = await user.update({ avatar_id: id_image });

    return res.json(result);
  }

  async getFile(req, res, next) {
    const [files] = await bucket.getFiles({ prefix: 'heroes.png' });
    return res.json(files);
  }
}

export default new ImageController();
