import program from 'commander-plus'
import {Payload} from './api/Payload';
const bent = require('bent')
const getJSON = bent('json')

program
    .option('-d --default', 'default run', true)
    .parse(process.argv)

const isDefault = program.default
const url = 'https://fantasy.premierleague.com/api/bootstrap-static/'

async function run() {
  const payload = await fetchPayload()
  console.log(payload.elements.length)
  console.log(isDefault)
}

async function fetchPayload() {
  let obj = await getJSON(url)
  return obj as Payload
}

// @ts-ignore
run()
