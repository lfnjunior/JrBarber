import bucket from '../configuration/storage';

class ImageController {
  async create(req, res, next) {
    if (!req.file) {
      return res.status(400).json({
        message: 'Nenhuma imagem foi fornecida',
      });
    }
    const [files] = await bucket.getFiles();
    return res.json(files);
  }
}

export default new ImageController();
