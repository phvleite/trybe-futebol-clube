import Match from '../database/models/match';
import Team from '../database/models/team';

interface IClassification {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

interface IBDRank {
  name: string;
  hg: number;
  ag: number;
}

const classification = {

  rank: (teams: Team[], matches: Match[]): IClassification[] => {
    const dbRank: IBDRank[] = [];
    const dbResult: IClassification[] = [];
    teams.forEach((team) => {
      matches.forEach((match) => {
        if (Number(team.id) === Number(match.homeTeam)) {
          dbRank.push({ name: team.teamName, hg: match.homeTeamGoals, ag: match.awayTeamGoals });
        }
      });
      const result = classification.rankCalculate(dbRank);
      dbResult.push(result);
      dbRank.splice(0, dbRank.length);
    });
    const boardResult: IClassification[] = classification.leaderboard(dbResult);
    return boardResult;
  },

  rankCalculate: (data: IBDRank[]): IClassification => {
    const J = data.length; let P = 0; let V = 0; let E = 0; let D = 0; let GP = 0; let GC = 0;
    data.forEach((match) => {
      if (match.hg > match.ag) { P += 3; V += 1; GP += match.hg; GC += match.ag; }
      if (match.hg < match.ag) { D += 1; GP += match.hg; GC += match.ag; }
      if (match.hg === match.ag) { P += 1; E += 1; GP += match.hg; GC += match.ag; }
    });
    const result = { name: data[0].name,
      totalPoints: P,
      totalGames: J,
      totalVictories: V,
      totalDraws: E,
      totalLosses: D,
      goalsFavor: GP,
      goalsOwn: GC,
      goalsBalance: GP - GC,
      efficiency: Number(((P / (J * 3)) * 100).toFixed(2)) };
    return result;
  },

  leaderboard: (board: IClassification[]): IClassification[] => {
    board.sort((team1, team2): number => {
      if (team1.totalPoints > team2.totalPoints) return -1;
      if (team1.totalPoints < team2.totalPoints) return 1;

      if (team1.totalVictories > team2.totalVictories) return -1;
      if (team1.totalVictories < team2.totalVictories) return 1;

      if (team1.goalsBalance > team2.goalsBalance) return -1;
      if (team1.goalsBalance < team2.goalsBalance) return 1;

      if (team1.goalsFavor > team2.goalsFavor) return -1;
      if (team1.goalsFavor < team2.goalsFavor) return 1;

      if (team1.goalsOwn > team2.goalsOwn) return -1;
      if (team1.goalsOwn < team2.goalsOwn) return 1;

      return 0;
    });
    return board;
  },
};

export default classification;
