import axios from 'axios';
import { jsonToCSV } from '../libs/json-to-csv';
import { writeFileSync } from 'fs';

const titles = [
  'GM',
  'WGM',
  'IM',
  'WIM',
  'FM',
  'WFM',
  'NM',
  'WNM',
  'CM',
  'WCM',
];

const main = async () => {
  const allTitledPlayers: { username: string; title: string }[] = [];
  for (const title of titles) {
    console.log(title);
    const url = `https://api.chess.com/pub/titled/${title}`;
    try {
      const {
        data: { players = [] },
      } = await axios.get<{ players: string[] }>(url);
      const titledPlayers = players.map((player) => {
        return { username: player, title };
      });
      allTitledPlayers.push(...titledPlayers);
    } catch (error) {
      console.error(error);
    }
    allTitledPlayers.sort((a, b) => {
      if (a.title === b.title) {
        return a.username > b.username ? 1 : -1;
      }
      return a.title > b.title ? 1 : -1;
    });
    const csv = jsonToCSV(allTitledPlayers, ['title', 'username']);
    writeFileSync('./data/chess.com/titled-players.csv', csv);
  }
};

main();
