import { Player } from '@/@types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BoltIcon from '@mui/icons-material/Bolt';
import FlagIcon from '@mui/icons-material/Flag';
import FunctionsIcon from '@mui/icons-material/Functions';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { ChangeEvent, ReactNode, useState } from 'react';

type RankingTableProps = {
  players: Player[];
};

type Column = 'name' | 'classical' | 'rapid' | 'blitz' | 'average' | 'country';

const COLUMNS: Column[] = [
  'name',
  'classical',
  'rapid',
  'blitz',
  'average',
  'country',
];

const icons: Record<Column, ReactNode> = {
  name: <AccountCircleIcon fontSize="small" />,
  classical: <GridViewIcon fontSize="small" />,
  rapid: <AccessTimeIcon fontSize="small" />,
  blitz: <BoltIcon fontSize="small" />,
  average: <FunctionsIcon fontSize="small" />,
  country: <FlagIcon fontSize="small" />,
};

export const RankingTable: React.FC<RankingTableProps> = ({ players }) => {
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<{ by: string; dir: number }>({
    by: 'classical',
    dir: 1,
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
      if (sort.by === 'country' || sort.by === 'name') {
        return sort.dir * (a[sort.by] > b[sort.by] ? 1 : -1);
      }
      return sort.dir * (a[sort.by] < b[sort.by] ? 1 : -1);
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
                NO
              </TableCell>
              {COLUMNS.map((column: Column, index: number) => {
                return (
                  <TableCell
                    key={column}
                    align={index === 0 ? 'left' : 'right'}
                  >
                    <span
                      className={`cursor-pointer uppercase inline-flex items-center gap-2 px-2 py-1 rounded ${
                        sort.by === column
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-900'
                      }`}
                      onClick={() =>
                        setSort({
                          by: column,
                          dir: column === sort.by ? -1 * sort.dir : 1,
                        })
                      }
                    >
                      {<>{icons[column]}</> || <></>}
                      {column}
                      {column === sort.by ? (
                        sort.dir === 1 ? (
                          <ArrowDropDownIcon />
                        ) : (
                          <ArrowDropUpIcon />
                        )
                      ) : (
                        <></>
                      )}
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
                  {COLUMNS.map((column: Column, index: number) => {
                    return (
                      <TableCell
                        key={column}
                        align={index === 0 ? 'left' : 'right'}
                      >
                        {column === 'name' ? (
                          <Link
                            href={`https://ratings.fide.com/profile/${player.id}`}
                            target="_blank"
                            className="underline"
                          >
                            {player[column]}
                          </Link>
                        ) : (
                          <>{player[column]}</>
                        )}
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
