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

interface IBDRankAll extends IBDRank {
  sit: string;
}

interface dataRank {
  name: string;
  j: number;
  p: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
}

export default class Classification {
  private data: dataRank;
  private result: IClassification;
  private board: IClassification[];

  rankHome(teams: Team[], matches: Match[]): IClassification[] {
    const dbRank: IBDRank[] = [];
    const dbResult: IClassification[] = [];
    teams.forEach((team) => {
      matches.forEach((match) => {
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
    teams.forEach((team) => {
      matches.forEach((match) => {
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
    const J = data.length; let P = 0; let V = 0; let E = 0; let D = 0; let GP = 0; let GC = 0;
    data.forEach((match) => {
      if (match.hg > match.ag) { P += 3; V += 1; GP += match.hg; GC += match.ag; }
      if (match.hg < match.ag) { D += 1; GP += match.hg; GC += match.ag; }
      if (match.hg === match.ag) { P += 1; E += 1; GP += match.hg; GC += match.ag; }
    });
    this.result = { name: data[0].name,
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
    const J = data.length; let P = 0; let V = 0; let E = 0; let D = 0; let GP = 0; let GC = 0;
    data.forEach((match) => {
      if (match.ag > match.hg) { P += 3; V += 1; GP += match.ag; GC += match.hg; }
      if (match.ag < match.hg) { D += 1; GP += match.ag; GC += match.hg; }
      if (match.ag === match.hg) { P += 1; E += 1; GP += match.ag; GC += match.hg; }
    });
    this.result = { name: data[0].name,
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

  rank(teams: Team[], matches: Match[]): IClassification[] {
    const dbRank: IBDRankAll[] = []; let sit: string;
    const dbResult: IClassification[] = [];
    teams.forEach((team) => {
      matches.forEach((match) => {
        if (Number(team.id) === Number(match.homeTeam)
          || Number(team.id) === Number(match.awayTeam)) {
          if (Number(team.id) === Number(match.homeTeam)) { sit = 'h'; }
          if (Number(team.id) === Number(match.awayTeam)) { sit = 'a'; }
          dbRank
            .push({ name: team.teamName, hg: match.homeTeamGoals, ag: match.awayTeamGoals, sit });
        }
      });
      const result = this.rankCalculate(dbRank);
      dbResult.push(result);
      dbRank.splice(0, dbRank.length);
    });
    return this.leaderboard(dbResult);
  }

  rankCalculate(data: IBDRankAll[]): IClassification {
    const j = data.length; const p = 0; const v = 0; const e = 0;
    const d = 0; const gp = 0; const gc = 0;
    const dataHome = data.filter((match) => match.sit === 'h');
    const dataAway = data.filter((match) => match.sit === 'a');
    this.data = { name: data[0].name, j, p, v, e, d, gp, gc };
    let dataRank: dataRank = this.data;
    dataHome.forEach((match) => {
      dataRank = this.rankAllHome(this.data, match);
    });
    dataAway.forEach((match) => {
      dataRank = this.rankAllAway(this.data, match);
    });
    this.result = this.rankResult(dataRank);
    return this.result;
  }

  rankAllHome(dataHome: dataRank, match: IBDRankAll): dataRank {
    let { p, v, e, d, gp, gc } = dataHome;
    if (match.hg > match.ag) { p += 3; v += 1; gp += match.hg; gc += match.ag; }
    if (match.hg < match.ag) { d += 1; gp += match.hg; gc += match.ag; }
    if (match.hg === match.ag) { p += 1; e += 1; gp += match.hg; gc += match.ag; }
    this.data = { name: dataHome.name, j: dataHome.j, p, v, e, d, gp, gc };
    return this.data;
  }

  rankAllAway(dataHome: dataRank, match: IBDRankAll): dataRank {
    let { p, v, e, d, gp, gc } = dataHome;
    if (match.ag > match.hg) { p += 3; v += 1; gp += match.ag; gc += match.hg; }
    if (match.ag < match.hg) { d += 1; gp += match.ag; gc += match.hg; }
    if (match.ag === match.hg) { p += 1; e += 1; gp += match.ag; gc += match.hg; }
    this.data = { name: dataHome.name, j: dataHome.j, p, v, e, d, gp, gc };
    return this.data;
  }

  rankResult(dbRank: dataRank): IClassification {
    this.result = { name: dbRank.name,
      totalPoints: dbRank.p,
      totalGames: dbRank.j,
      totalVictories: dbRank.v,
      totalDraws: dbRank.e,
      totalLosses: dbRank.d,
      goalsFavor: dbRank.gp,
      goalsOwn: dbRank.gc,
      goalsBalance: dbRank.gp - dbRank.gc,
      efficiency: Number(((dbRank.p / (dbRank.j * 3)) * 100).toFixed(2)) };
    return this.result;
  }

  // ------ classificação da tabela ------

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
