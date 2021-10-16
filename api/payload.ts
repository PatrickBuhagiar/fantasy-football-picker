import {Event} from './event';
import {Team} from './team';
import {ElementStat} from './elementStat';
import {ElementType} from './elementType';
import {GameSettings} from './gameSettings';
import {Phase} from './phase';
import {PlayerElement} from './playerElement';

export interface Payload {
  events: Event[];
  game_settings: GameSettings;
  phases: Phase[];
  teams: Team[];
  total_players: number;
  elements: PlayerElement[];
  element_stats: ElementStat[];
  element_types: ElementType[];
}