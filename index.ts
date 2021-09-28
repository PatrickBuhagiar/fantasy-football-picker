import program from 'commander-plus'
import {Payload} from './api/Payload';
import _ from 'lodash'
import {TeamSelection} from './model/TeamSelection';
import {Element} from './api/Element';
import {Player} from './model/Player';
import {Team} from './api/Team';

const bent = require('bent')
const getJSON = bent('json')

program
    .option('-d --default', 'default run', true)
    .parse(process.argv)

const isDefault = program.default
const url = 'https://fantasy.premierleague.com/api/bootstrap-static/'
let teams: Team[]

async function run() {
  const payload = await fetchPayload()

  let bestTeam: TeamSelection = null
  if (isDefault) {
    for (let i = 0; i < 3000000; i++) {
      // pick team at random
      let newTeam = selectTeam(payload)
      if (newTeam.score) {
        if (bestTeam === null || bestTeam.score < newTeam.score) {
          bestTeam = newTeam
        }
      }
    }
    console.log(bestTeam)
  }
}

function moreThan3SameTeam(groupedByTeam: { number: Element[] }) {
  return Object.values(groupedByTeam).map(({length}) => length).some(length => length > 3)
}

function validate(allPlayers: Element[], totalCost: number) {
  const groupedByTeam: {number: Element[]} = _.groupBy(allPlayers, 'team')
  if (totalCost > 998) {
    return false
  }
  return !moreThan3SameTeam(groupedByTeam);
}

function selectTeam(payload: Payload): TeamSelection {
  // filter pool of players
  const {keepers, defenders, midfielders, forwards} = extractPlayers(payload)
  const selectedKeepers = takeRandomN(2, keepers)
  const selectedDefenders = takeRandomN(5, defenders)
  const selectedMidfielders = takeRandomN(5, midfielders)
  const selectedForwards = takeRandomN(3, forwards)

  const allPlayers: Element[] = [...selectedKeepers, ...selectedDefenders, ...selectedMidfielders, ...selectedForwards]
  const totalCost = allPlayers.map( ({now_cost}) => now_cost).reduce((a, b) => a + b, 0)
  const totalForm = allPlayers.map(({form}) => Number.parseFloat(form)).reduce((a, b) => a + b, 0)
  const totalPoints = allPlayers.map(({total_points}) => total_points).reduce((a, b) => a + b, 0) + totalForm
  teams = payload.teams

  return {
    players: mapPlayers(allPlayers),
    totalCost: totalCost,
    score: validate(allPlayers, totalCost) ? totalPoints : 0
  }
}

function mapPlayers(collection: Element[]): Player[] {
  return collection.map(element => toPlayer(element))
}

function getTeamName(teamIndex: number) {
  return teams.filter(team => team.id === teamIndex)[0].name
}

function toPlayer(element: Element): Player {
  return {
    name: element.web_name,
    team: getTeamName(element.team),
    price: element.now_cost,
    totalPoints: element.total_points,
    pointsPerGame: element.points_per_game,
    selectionPercentage: element.selected_by_percent,
    bonus: element.bonus,
    goalsScored: element.goals_scored,
    assists: element.assists,
    saves: element.saves,
    penaltiesSaved: element.penalties_saved,
    penaltiesMissed: element.penalties_missed,
    form: element.form
  };
}

function takeRandomN(n: number, collection: Element[]) {
  return _.shuffle(collection).slice(0, n)
}

function extractPlayers(payload: Payload) {
  const players = payload.elements
  const groups = _.groupBy(players, "element_type")
  const keepers: Element[] = takeTopBy(groups["1"]) // 15 item
  const defenders: Element[] = takeTopBy(groups["2"]) // 15 items
  const midfielders: Element[] = takeTopBy(groups["3"]) // 15 items
  const forwards: Element[] = takeTopBy(groups["4"]) // 15 items

  return {keepers, defenders, midfielders, forwards}
}

function takeTopBy(collection: Element[], n: number = 15) {
  return collection
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, n)
}

async function fetchPayload() {
  let obj = await getJSON(url)
  return obj as Payload
}

// @ts-ignore
run()
