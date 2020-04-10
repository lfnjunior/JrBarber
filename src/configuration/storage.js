const path = require('path');
const { Storage } = require('@google-cloud/storage');

const gc = new Storage({
  keyFilename: path.join(__dirname, './peca-certa-50af2b5df198.json'),
  projectId: 'peca-certa',
});

const bucket = gc.bucket('images-lfnjunior');

export default bucket;
