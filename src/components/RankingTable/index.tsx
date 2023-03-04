import { Player } from '@/@types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useState } from 'react';

type RankingTableProps = {
  players: Player[];
};

const COLUMNS = ['name', 'classical', 'rapid', 'blitz', 'average', 'country'];

export const RankingTable: React.FC<RankingTableProps> = ({ players }) => {
  const [query, setQuery] = useState<string>('');
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
      <div className="px-4 pt-4">
        <TextField
          id="query"
          fullWidth
          size="small"
          placeholder="Query"
          label="Query"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
        />
      </div>
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

RankingTable.displayName = 'RankingTable';

export default RankingTable;
