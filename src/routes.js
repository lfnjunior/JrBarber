import { Router } from 'express';

const routes = new Router();

routes.get('/user', (req, res) => {
  console.log('teste');
  res.send({ test: 'ah' });
});
routes.get('/users', () => {});
routes.post('/user', () => {});
routes.put('/user/:id', () => {});
routes.delete('/user/:id', () => {});

export default routes;
