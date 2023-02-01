import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { csvToJSON } from '../libs/csv-to-json';

type Game = {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  accuracies: {
    white: number;
    black: number;
  };
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
    uuid: string;
  };
  black: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
    uuid: string;
  };
};

const main = async () => {
  const titledPlayersCSV: string = readFileSync(
    './data/chess.com/titled-players.csv',
    'utf-8'
  );
  const titledPlayers = csvToJSON(titledPlayersCSV);
  const filteredPlayers = titledPlayers.filter(({ title }) => title === 'CM');
  filteredPlayers.sort((a, b) => (a.username < b.username ? 1 : -1));

  for (const { username } of filteredPlayers) {
    const url = `https://api.chess.com/pub/player/${username}/games/archives`;
    try {
      const {
        data: { archives = [] },
      } = await axios.get<{ archives: string[] }>(url);
      archives.sort();
      archives.reverse();

      for (const archive of archives) {
        const {
          data: { games = [] },
        } = await axios.get<{ games: Game[] }>(archive);
        for (const game of games) {
          const { uuid, pgn, end_time, time_class, rules, time_control } = game;
          const [date] = new Date(end_time * 1000).toISOString().split('T');
          const folder = `./data/chess.com/games/archives/${username}/${rules}/${time_class}/${time_control}/${date}`;
          const exists = existsSync(folder);
          if (!exists) mkdirSync(folder, { recursive: true });
          console.log(username, date);
          writeFileSync(`${folder}/${uuid}.pgn`, pgn);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

main();
