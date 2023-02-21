import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Player } from '@prisma/client';
import { GetServerSidePropsResult, NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import log from '../libs/log';
import { prismaClient } from '../libs/prisma';

type PlayersProps = {
  players: Omit<Player, 'createdAt' | 'updatedAt'>[];
};

const COLUMNS = ['name', 'classical', 'rapid', 'blitz', 'average', 'country'];

const RankingTable: React.FC<PlayersProps & { query: string }> = ({
  query = '',
  players,
}) => {
  const [state, setState] = useState<{ sortBy: string }>({
    sortBy: 'classical',
  });

  const sortedPlayers = players
    .filter((player) => {
      if (query === '') {
        return true;
      }
      return (
        player.name.toLowerCase().includes(query.toLowerCase()) ||
        player.country.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a: any, b: any) => {
      if (state.sortBy === 'country' || state.sortBy === 'name') {
        return a[state.sortBy] > b[state.sortBy] ? 1 : -1;
      }
      return a[state.sortBy] < b[state.sortBy] ? 1 : -1;
    });

  return (
    <Paper className="border">
      <TableContainer>
        <Table stickyHeader sx={{ minWidth: 430 }} aria-label="2700chess">
          <TableHead className="uppercase">
            <TableRow>
              <TableCell align="center" scope="row" sx={{ width: '64px' }}>
                Rank
              </TableCell>
              {COLUMNS.map((key: string, index: number) => {
                return (
                  <TableCell key={key} align={index === 0 ? 'left' : 'right'}>
                    <span
                      className={`cursor-pointer uppercase ${
                        state.sortBy === key
                          ? 'bg-gray-900 text-white px-2 py-1 rounded'
                          : ''
                      }`}
                      onClick={() => setState({ ...state, sortBy: key })}
                    >
                      {key}
                    </span>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player: any, index: number) => {
              return (
                <TableRow
                  key={player.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="center" scope="row" sx={{ width: '64px' }}>
                    {index + 1}
                  </TableCell>
                  {COLUMNS.map((key: string, index: number) => {
                    return (
                      <TableCell
                        key={key}
                        align={index === 0 ? 'left' : 'right'}
                      >
                        {player[key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const HomePage: NextPage<PlayersProps> = ({ players = [] }) => {
  const [query, setQuery] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <Container>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="uppercase text-xl">2700 Chess</h1>
              <TextField
                size="small"
                placeholder="Query"
                label="Query"
                value={query}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setQuery(event.target.value)
                }
              />
            </div>
          </div>
        </Container>
      </nav>
      <main className="grow">
        <Container>
          <div className="py-8">
            <RankingTable query={query} players={players} />
          </div>
        </Container>
      </main>
      <footer className="border-t">
        <Container>
          <div className="py-4">
            &copy; {new Date().getFullYear()} - 2700 CHESS
          </div>
        </Container>
      </footer>
    </div>
  );
};

export const getServerSideProps = async (): Promise<
  GetServerSidePropsResult<PlayersProps>
> => {
  try {
    const players = await prismaClient.player.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        classical: true,
        rapid: true,
        blitz: true,
        average: true,
      },
      where: {
        OR: [
          { classical: { gte: 2700 } },
          { rapid: { gte: 2700 } },
          { blitz: { gte: 2700 } },
        ],
      },
    });
    log.info(players);
    return { props: { players } };
  } catch (error) {
    log.error(error);
    return { props: { players: [] } };
  }
};

export default HomePage;
