import {ChipPlay} from './ChipPlay';

export interface Event {
  id: number;
  name: string;
  deadline_time: Date;
  average_entry_score: number;
  finished: boolean;
  data_checked: boolean;
  highest_scoring_entry?: any;
  deadline_time_epoch: number;
  deadline_time_game_offset: number;
  highest_score?: any;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  chip_plays: ChipPlay[];
  most_selected?: any;
  most_transferred_in?: any;
  top_element?: any;
  top_element_info?: any;
  transfers_made: number;
  most_captained?: any;
  most_vice_captained?: any;
}