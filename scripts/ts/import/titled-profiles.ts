import axios, { AxiosError } from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import chunk from 'lodash/chunk';
import { csvToJSON } from '../libs/csv-to-json';
import { jsonToCSV } from '../libs/json-to-csv';

type Profile = {
  '@id': string;
  avatar: string;
  player_id: number;
  url: string;
  name: string;
  username: string;
  title: string;
  followers: number;
  country: string;
  location: string;
  last_online: number;
  joined: number;
  status: string;
  is_streamer: boolean;
  twitch_url: string;
  verified: boolean;
};

const getProfile = async (username: string): Promise<Profile> => {
  console.log(username);
  const url = `https://api.chess.com/pub/player/${username}`;
  const { data } = await axios.get<Profile>(url);
  return data;
};

const main = async () => {
  const titledPlayersCSV: string = readFileSync(
    './data/chess.com/titled-players.csv',
    'utf-8'
  );
  const titledPlayers = csvToJSON(titledPlayersCSV);
  titledPlayers.sort((a, b) => (a.username > b.username ? 1 : -1));

  // const allProfiles: Profile[] = [];
  for (const { username } of titledPlayers) {
    try {
      const profile: Profile = await getProfile(username);
      writeFileSync(
        `./data/chess.com/profiles/${username}.json`,
        JSON.stringify(profile, null, 2)
      );
    } catch (error) {
      console.error(error);
    }
    // allProfiles.push(profile);
    // const csv = jsonToCSV(allProfiles, [
    //   'title',
    //   'username',
    //   'avatar',
    //   'player_id',
    //   '@id',
    //   'url',
    //   'name',
    //   'followers',
    //   'country',
    //   'location',
    //   'last_online',
    //   'joined',
    //   'status',
    //   'is_streamer',
    //   'twitch_url',
    //   'verified',
    // ]);
    // writeFileSync('./data/chess.com/titled-profiles.csv', csv);
  }
};

main();
