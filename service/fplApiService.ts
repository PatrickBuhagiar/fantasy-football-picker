import {Payload} from '../api/payload';

const bent = require('bent')
const getJSON = bent('json')

const url = 'https://fantasy.premierleague.com/api/bootstrap-static/'

export class FplApiService {

  async fetch() {
    let obj = await getJSON(url)
    return obj as Payload
  }

}