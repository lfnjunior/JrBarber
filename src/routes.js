import { Router } from 'express';
import multer from 'multer';
import multerConfig from './configuration/multer';
import UserController from './controllers/userController';
import ImageController from './controllers/imageController';
import UserValidator from './validators/userValidator';
import loginController from './controllers/loginController';
import ProviderController from './controllers/providerController';
import AppointmentController from './controllers/appointmentContoller';
import AppointmentValidator from './validators/appointmentValidator';

import authentication from './middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/login', UserValidator.login, loginController.login);
routes.post('/user', UserValidator.create, UserController.create);

routes.use(authentication);

routes.get('/user/:id', UserController.search);
routes.get('/users', UserController.list);
routes.put('/user', UserValidator.update, UserController.update);
routes.delete('/user/:id', UserController.delete);

routes.post('/upload', upload.single('file'), ImageController.create);

routes.get('/providers', ProviderController.search);

routes.post(
  '/appointment',
  AppointmentValidator.create,
  AppointmentController.create
);
routes.get('/appointment/:id', AppointmentController.search);
routes.get('/appointments', AppointmentController.list);
routes.put('/appointment', AppointmentController.update);
routes.delete('/appointment/:id', AppointmentController.delete);

export default routes;
