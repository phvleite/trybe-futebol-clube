import { Router } from 'express';
import MatchController from '../controllers/matchesController';
import MatchService from '../services/matchesService';

const matchesService = new MatchService();
const matchesController = new MatchController(matchesService);

const matchesRouter = Router();

matchesRouter.get('/matches', (req, res) => matchesController.list(req, res));

export default matchesRouter;
