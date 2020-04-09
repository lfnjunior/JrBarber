import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../configuration/auth';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: 'Um token de acesso é esperado.',
    });
  }

  const [, token] = await auth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Acesso não autorizado.',
    });
  }
};
