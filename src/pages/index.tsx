import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import useAxios from '../hooks/use-axios';
import { Ranking, TimeControl } from '../types';

const RankingTable: React.FC<{ timeControl: TimeControl }> = ({
  timeControl = 'classical',
}) => {
  const url: string = `/api/2700?timecontrol=${timeControl}`;
  const { loading, data, error } = useAxios<{ rankings: Ranking[] }>(url);

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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 430 }}>
        <Table stickyHeader sx={{ minWidth: 430 }} aria-label="2700chess">
          <TableHead>
            <TableRow>
              <TableCell align="center" scope="row" sx={{ width: '64px' }}>
                <b>Rank</b>
              </TableCell>
              <TableCell className="font-semibold">
                <b>Name</b>
              </TableCell>
              <TableCell className="font-semibold" align="right">
                <b>Rating</b>
              </TableCell>
              <TableCell className="font-semibold" align="right">
                <b>Country</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data?.rankings || []).map((ranking) => {
              return (
                <TableRow
                  key={ranking.rank}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="center" scope="row" sx={{ width: '64px' }}>
                    {ranking.rank}
                  </TableCell>
                  <TableCell>{ranking.name}</TableCell>
                  <TableCell align="right">
                    <b>{ranking.rating}</b>
                  </TableCell>
                  <TableCell align="right">{ranking.country}</TableCell>
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
  const [timeControl, setTimeControl] = useState<TimeControl>('classical');

  const changeTimeControl = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeControl: string
  ) => {
    console.log(newTimeControl);
    setTimeControl(newTimeControl as TimeControl);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <Stack spacing={2} alignItems="center" className="w-full">
            <ToggleButtonGroup
              size="small"
              value={timeControl}
              exclusive={true}
              onChange={changeTimeControl}
            >
              <ToggleButton
                value="classical"
                key="classical"
                selected={timeControl === 'classical'}
              >
                <div className="px-4 md:px-8">Classical</div>
              </ToggleButton>
              <ToggleButton
                value="rapid"
                key="rapid"
                selected={timeControl === 'rapid'}
              >
                <div className="px-4 md:px-8">Rapid</div>
              </ToggleButton>
              <ToggleButton
                value="blitz"
                key="blitz"
                selected={timeControl === 'blitz'}
              >
                <div className="px-4 md:px-8">Blitz</div>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </div>
        <div className="border rounded shadow">
          <RankingTable timeControl={timeControl} />
        </div>
      </main>
    </>
  );
};

export default HomePage;
