import { Router } from 'express';
import LeaderbaordsController from '../controllers/leaderboardsController';

const leaderboardsController = new LeaderbaordsController();

const leaderboardsRouter = Router();

leaderboardsRouter
  .get('/leaderboard/home', (req, res) => leaderboardsController.listHome(req, res));

leaderboardsRouter
  .get('/leaderboard/away', (req, res) => leaderboardsController.listAway(req, res));

leaderboardsRouter
  .get('/leaderboard', (req, res) => leaderboardsController.list(req, res));

export default leaderboardsRouter;
