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

export default class Classification {
  private teams: Team[];
  private matches: Match[];
  private data: IBDRank[];
  private result: IClassification;
  private board: IClassification[];

  rankHome(teams: Team[], matches: Match[]): IClassification[] {
    const dbRank: IBDRank[] = [];
    const dbResult: IClassification[] = [];
    this.teams = teams; this.matches = matches;
    this.teams.forEach((team) => {
      this.matches.forEach((match) => {
        if (Number(team.id) === Number(match.homeTeam)) {
          dbRank.push({ name: team.teamName, hg: match.homeTeamGoals, ag: match.awayTeamGoals });
        }
      });
      const result = this.rankCalculateHome(dbRank);
      dbResult.push(result);
      dbRank.splice(0, dbRank.length);
    });
    return this.leaderboard(dbResult);
  }

  rankAway(teams: Team[], matches: Match[]): IClassification[] {
    const dbRank: IBDRank[] = [];
    const dbResult: IClassification[] = [];
    this.teams = teams; this.matches = matches;
    this.teams.forEach((team) => {
      this.matches.forEach((match) => {
        if (Number(team.id) === Number(match.awayTeam)) {
          dbRank.push({ name: team.teamName, hg: match.homeTeamGoals, ag: match.awayTeamGoals });
        }
      });
      const result = this.rankCalculateAway(dbRank);
      dbResult.push(result);
      dbRank.splice(0, dbRank.length);
    });
    return this.leaderboard(dbResult);
  }

  rankCalculateHome(data: IBDRank[]): IClassification {
    this.data = data;
    const J = this.data.length; let P = 0; let V = 0; let E = 0; let D = 0; let GP = 0; let GC = 0;
    this.data.forEach((match) => {
      if (match.hg > match.ag) { P += 3; V += 1; GP += match.hg; GC += match.ag; }
      if (match.hg < match.ag) { D += 1; GP += match.hg; GC += match.ag; }
      if (match.hg === match.ag) { P += 1; E += 1; GP += match.hg; GC += match.ag; }
    });
    this.result = { name: this.data[0].name,
      totalPoints: P,
      totalGames: J,
      totalVictories: V,
      totalDraws: E,
      totalLosses: D,
      goalsFavor: GP,
      goalsOwn: GC,
      goalsBalance: GP - GC,
      efficiency: Number(((P / (J * 3)) * 100).toFixed(2)) };
    return this.result;
  }

  rankCalculateAway(data: IBDRank[]): IClassification {
    this.data = data;
    const J = this.data.length; let P = 0; let V = 0; let E = 0; let D = 0; let GP = 0; let GC = 0;
    this.data.forEach((match) => {
      if (match.ag > match.hg) { P += 3; V += 1; GP += match.ag; GC += match.hg; }
      if (match.ag < match.hg) { D += 1; GP += match.ag; GC += match.hg; }
      if (match.ag === match.hg) { P += 1; E += 1; GP += match.ag; GC += match.hg; }
    });
    this.result = { name: this.data[0].name,
      totalPoints: P,
      totalGames: J,
      totalVictories: V,
      totalDraws: E,
      totalLosses: D,
      goalsFavor: GP,
      goalsOwn: GC,
      goalsBalance: GP - GC,
      efficiency: Number(((P / (J * 3)) * 100).toFixed(2)) };
    return this.result;
  }

  leaderboard(board: IClassification[]): IClassification[] {
    this.board = board;
    this.board.sort((team1: IClassification, team2: IClassification): number => {
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
    return this.board;
  }
}
