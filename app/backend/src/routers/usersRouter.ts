import { Router } from 'express';
import UserController from '../controllers/usersController';
import UserService from '../services/usersService';

const userService = new UserService();
const usersController = new UserController(userService);

const usersRouter = Router();

usersRouter.get('/users', (req, res) => usersController.list(req, res));
usersRouter.post('/users', (req, res) => usersController.checkIfExistEmail(req, res));

export default usersRouter;
