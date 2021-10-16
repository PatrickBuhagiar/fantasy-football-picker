import program from 'commander-plus'
import {TeamSelection} from './model/teamSelection';

import {TeamPickerService} from './service/teamPickerService';
import {FplApiService} from './service/fplApiService';


program
    .option('-r, --runs <runs>', 'max runs', '1000000')
    .option('-v, --value <value>', 'team value', '1000')
    .parse(process.argv)

const maxRuns = Number.parseInt(program.runs, 10)
const maxTeamValue = Number.parseInt(program.value)

async function run(fplApiService: FplApiService) {
  // fetch Player and Team Data from API
  const payload = await fplApiService.fetch()
  const teamPickerService = new TeamPickerService(payload, maxTeamValue)
  let bestTeam: TeamSelection = null

  for (let i = 0; i < maxRuns; i++) {
    // pick team at random
    let randomTeam = teamPickerService.selectRandomTeam()
    // only store team if the team has a higher score than the previous runs
    if (newOrBetter(randomTeam)) {
      bestTeam = randomTeam
    }
  }

  // print the highest scoring team
  console.table(bestTeam.players)
  console.log(`Total score: ${bestTeam.score}`)
  console.log(`Total cost: ${bestTeam.totalCost}`)

  function newOrBetter(newTeam: TeamSelection) {
    return newTeam.score && (bestTeam === null || bestTeam.score < newTeam.score);
  }
}

// @ts-ignore
run(new FplApiService())
