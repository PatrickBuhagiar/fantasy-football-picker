import {Payload} from '../api/payload';
import {PlayerElement} from '../api/playerElement';
import {TeamSelection} from '../model/teamSelection';
import {Team} from '../api/team';
import {Utils} from '../utils/utils';
import _ from 'lodash'

export class TeamPickerService {

  teams: Team[]
  keepers: PlayerElement[]
  defenders: PlayerElement[]
  midfielders: PlayerElement[]
  forwards: PlayerElement[]
  maxTeamValue: number

  constructor(payload: Payload, maxTeamValue: number) {
    const {keepers, defenders, midfielders, forwards} = TeamPickerService.extractPlayersFrom(payload)
    this.teams = payload.teams
    this.keepers = keepers
    this.defenders = defenders
    this.midfielders = midfielders
    this.forwards = forwards
    this.maxTeamValue = maxTeamValue
  }

  selectRandomTeam(): TeamSelection {
    const allPlayers = this.pickRandomPlayers();

    const totalCost = TeamPickerService.getTotalCost(allPlayers)
    const totalForm = TeamPickerService.getTotalForm(allPlayers)
    const totalPoints = TeamPickerService.sumPointsAndForm(allPlayers, totalForm)

    return {
      players: Utils.mapPlayers(allPlayers, this.teams),
      totalCost: totalCost,
      score: TeamPickerService.validate(allPlayers, totalCost, this.maxTeamValue) ? totalPoints : 0
    }
  }

  /**
   * Validate that:
   *  - the team does not exceed the cost
   *  - there are no more than 3 players from the same team
   * @param allPlayers
   * @param totalCost
   * @param maxTeamValue
   */
  private static validate(allPlayers: PlayerElement[], totalCost: number, maxTeamValue: number) {
    const groupedByTeam: { number: PlayerElement[] } = _.groupBy(allPlayers, 'team')
    if (totalCost > maxTeamValue) {
      return false
    }
    return !Utils.moreThan3SameTeam(groupedByTeam);
  }

  private static sumPointsAndForm(allPlayers: PlayerElement[], totalForm: number) {
    return allPlayers.map(({total_points}) => total_points).reduce((a, b) => a + b, 0) + totalForm;
  }

  private static getTotalForm(allPlayers: PlayerElement[]) {
    return allPlayers.map(({form}) => Number.parseFloat(form)).reduce((a, b) => a + b, 0);
  }

  private static getTotalCost(allPlayers: PlayerElement[]) {
    return allPlayers.map(({now_cost}) => now_cost).reduce((a, b) => a + b, 0);
  }

  private static extractPlayersFrom(payload: Payload) {
    const players = payload.elements
    const groups = _.groupBy(players, "element_type")
    const keepers: PlayerElement[] = Utils.takeTopBy(groups["1"]) // 15 item
    const defenders: PlayerElement[] = Utils.takeTopBy(groups["2"]) // 15 items
    const midfielders: PlayerElement[] = Utils.takeTopBy(groups["3"]) // 15 items
    const forwards: PlayerElement[] = Utils.takeTopBy(groups["4"]) // 15 items

    return {keepers, defenders, midfielders, forwards}
  }

  private pickRandomPlayers() {
    const selectedKeepers = Utils.takeRandomN(2, this.keepers)
    const selectedDefenders = Utils.takeRandomN(5, this.defenders)
    const selectedMidfielders = Utils.takeRandomN(5, this.midfielders)
    const selectedForwards = Utils.takeRandomN(3, this.forwards)

    const allPlayers: PlayerElement[] = [...selectedKeepers, ...selectedDefenders, ...selectedMidfielders, ...selectedForwards]
    return allPlayers;
  }
}