import { Router } from 'express';
import MatchController from '../controllers/matchesController';
import MatchService from '../services/matchesService';

const matchesService = new MatchService();
const matchesController = new MatchController(matchesService);

const matchesRouter = Router();

matchesRouter.get('/matches', (req, res) => matchesController.list(req, res));
matchesRouter.post('/matches', (req, res) => matchesController.create(req, res));
matchesRouter.patch('/matches/:id', (req, res) => matchesController.update(req, res));
matchesRouter.patch('/matches/:id/finish', (req, res) => matchesController.finished(req, res));

export default matchesRouter;
