import { Router } from 'express';
import TeamController from '../controllers/teamsController';
import TeamService from '../services/teamsService';

const teamsService = new TeamService();
const teamsController = new TeamController(teamsService);

const teamsRouter = Router();

teamsRouter.get('/teams', (req, res) => teamsController.list(req, res));
teamsRouter.get('/teams/:id', (req, res) => teamsController.getTeamById(req, res));

export default teamsRouter;
