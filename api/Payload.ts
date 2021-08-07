import {Event} from './Event';
import {Team} from './Team';
import {ElementStat} from './ElementStat';
import {ElementType} from './ElementType';
import {GameSettings} from './GameSettings';
import {Phase} from './Phase';

export interface Payload {
  events: Event[];
  game_settings: GameSettings;
  phases: Phase[];
  teams: Team[];
  total_players: number;
  elements: Element[];
  element_stats: ElementStat[];
  element_types: ElementType[];
}