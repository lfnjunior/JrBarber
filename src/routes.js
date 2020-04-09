import { Router } from 'express';
import UserController from './controllers/userController';
import UserValidator from './validators/userValidator';
import loginController from './controllers/loginController';
import authentication from './middlewares/auth';

const routes = new Router();

routes.post('/login', UserValidator.login, loginController.login);
routes.post('/user', UserValidator.create, UserController.create);

routes.use(authentication);

routes.get('/user/:id', UserController.search);
routes.get('/users', UserController.list);
routes.put('/user/:id', UserValidator.update, UserController.update);
routes.delete('/user/:id', UserController.delete);

export default routes;
