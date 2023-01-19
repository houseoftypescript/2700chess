import { Button, Typography } from '@mui/material';
import axios from 'axios';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import Navbar from '../../../../components/Navbar';

type Game = {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: true;
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
    '@id': string;
    rating: number;
    result: string;
    username: string;
    uuid: string;
  };
  black: {
    '@id': string;
    rating: number;
    result: string;
    username: string;
    uuid: string;
  };
};

type ChessComArchivesPageProps = { username: string; games: Game[] };

const ChessComArchivesPage: NextPage<ChessComArchivesPageProps> = ({
  username = '',
  games = [],
}) => {
  const downloadPGN = (id: string, pgn: string) => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8, ' + encodeURIComponent(pgn)
    );
    element.setAttribute('download', `${id}.pgn`);
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="border rounded shadow">
          {games.map((game) => {
            const userSide: string =
              username.toLowerCase() === game.white.username.toLowerCase()
                ? 'white'
                : 'black';
            const whiteBold = userSide === 'white' ? 'font-bold' : '';
            const blackBold = userSide === 'black' ? 'font-bold' : '';
            return (
              <div key={game.uuid} className="border-b px-8 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 sm:gap-8">
                  <div className="col-span-1 text-center uppercase">
                    {game.time_class}
                  </div>
                  <div className="col-span-1 text-center sm:text-left">
                    <Typography className="text-gray-500">Username</Typography>
                    <Typography className={`truncate ${whiteBold}`}>
                      @{game.white.username} ({game.white.rating})
                    </Typography>
                    <Typography className={`truncate ${blackBold}`}>
                      @{game.black.username} ({game.black.rating})
                    </Typography>
                  </div>
                  <div className="col-span-1 text-center sm:text-right">
                    <Typography className="text-gray-500">Accuracy</Typography>
                    <div className="capitalize">
                      <Typography className={whiteBold}>
                        {game.white.result} ({game.accuracies.white}%)
                      </Typography>
                      <Typography className={blackBold}>
                        {game.black.result} ({game.accuracies.black}%)
                      </Typography>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outlined"
                      className="w-full"
                      onClick={() => {
                        const id: string =
                          `${game.white.username}-${game.black.username}-${game.uuid}`.toLowerCase();
                        downloadPGN(id, game.pgn);
                      }}
                    >
                      PGN
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ChessComArchivesPageProps>> => {
  const username: string = context.query.username as string;
  const year: number =
    parseInt(context.query.year as string, 10) || new Date().getFullYear();
  try {
    const archivesUrl = `https://api.chess.com/pub/player/${username}/games/archives`;
    const { data: { archives = [] } = { archives: [] } } = await axios.get<{
      archives: string[];
    }>(archivesUrl);
    console.log('year', year);
    const filteredArchives: string[] = archives.filter((archive) =>
      archive.includes(year.toString())
    );
    console.log('filteredArchives', filteredArchives);
    let allGames: Game[] = [];
    for (const archive of filteredArchives) {
      console.log('archive', archive);
      const { data: { games = [] } = { games: [] } } = await axios.get<{
        games: Game[];
      }>(archive);
      allGames = allGames.concat(games);
    }
    allGames.sort((a, b) => (a.end_time < b.end_time ? 1 : -1)).splice(0, 10);
    return { props: { username, games: allGames } };
  } catch (error) {
    console.error(error);
    return { props: { username, games: [] } };
  }
};

export default ChessComArchivesPage;
