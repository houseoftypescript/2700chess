import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Player } from '@prisma/client';
import { NextPage } from 'next';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import useAxios from '../hooks/use-axios';
import { TimeClass } from '../types';

const RankingTable: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('classical');
  const url: string = `/api/players`;
  const { loading, data, error } = useAxios<{ players: Player[] }>(url);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <h2 className="text-xl uppercase">Loading</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <h2 className="text-xl uppercase">Error</h2>
      </div>
    );
  }

  const sortedPlayers = (data?.players || []).sort((a: any, b: any) => {
    if (sortBy === 'country' || sortBy === 'name') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  const keys = ['name', 'classical', 'rapid', 'blitz', 'average', 'country'];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 430 }}>
        <Table stickyHeader sx={{ minWidth: 430 }} aria-label="2700chess">
          <TableHead className="uppercase">
            <TableRow>
              <TableCell align="center" scope="row" sx={{ width: '64px' }}>
                Rank
              </TableCell>
              {keys.map((key: string, index: number) => {
                return (
                  <TableCell key={key} align={index === 0 ? 'left' : 'right'}>
                    <span
                      className={`cursor-pointer uppercase ${
                        sortBy === key ? 'underline' : ''
                      }`}
                      onClick={() => setSortBy(key)}
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
                  {keys.map((key: string, index: number) => {
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

const HomePage: NextPage = () => {
  const [timeClass, setTimeClass] = useState<TimeClass>('classical');

  const changeTimeClass = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeClass: string
  ) => {
    console.log(newTimeClass);
    setTimeClass(newTimeClass as TimeClass);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="border rounded shadow">
          <RankingTable />
        </div>
      </main>
    </>
  );
};

export default HomePage;
