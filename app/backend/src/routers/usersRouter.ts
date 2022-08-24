import { Router } from 'express';
import UserController from '../controllers/usersController';
import UserService from '../services/usersService';

const userService = new UserService();
const usersController = new UserController(userService);

const usersRouter = Router();

usersRouter.post('/login', (req, res) => usersController.login(req, res));
usersRouter.get('/login/validate', (req, res) => usersController.loginValidate(req, res));

export default usersRouter;
