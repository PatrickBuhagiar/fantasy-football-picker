import {PlayerElement} from '../api/playerElement';
import _ from 'lodash'
import {Player} from '../model/player';
import {Team} from '../api/team';

export class Utils {

  static takeRandomN(n: number, collection: PlayerElement[]) {
    return _.shuffle(collection).slice(0, n)
  }

  static takeTopBy(collection: PlayerElement[], n: number = 15) {
    return collection
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, n)
  }

  static mapPlayers(collection: PlayerElement[], teams: Team[]): Player[] {
    return collection.map(element => this.toPlayer(element, teams))
  }

  static getTeamName(teams: Team[], teamIndex: number) {
    return teams.find(team => team.id === teamIndex).name
  }

  static toPlayer(element: PlayerElement, teams: Team[]): Player {
    return {
      name: element.web_name,
      team: this.getTeamName(teams, element.team),
      price: element.now_cost,
      totalPoints: element.total_points,
      pointsPerGame: element.points_per_game,
      selectionPercentage: element.selected_by_percent,
      bonus: element.bonus,
      goalsScored: element.goals_scored,
      assists: element.assists,
      form: element.form
    };
  }

  static moreThan3SameTeam(groupedByTeam: { number: PlayerElement[] }) {
    return Object.values(groupedByTeam).map(({length}) => length).some(length => length > 3)
  }

}
