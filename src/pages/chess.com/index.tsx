import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Titled } from '../../constants';

type ChessComPageProps = { defaultTitled: Titled; defaultPlayers: string[] };

const ChessComPage: NextPage<ChessComPageProps> = ({
  defaultTitled = Titled.GRAND_MASTER,
  defaultPlayers = [],
}) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [list, setList] = useState<{ loading: boolean; players: string[] }>({
    loading: false,
    players: defaultPlayers,
  });
  const [username, setUsername] = useState<string>('');
  const [titled, setTitled] = useState<Titled>(defaultTitled);

  useEffect(() => {
    const getPlayers = async () => {
      setList({ ...list, loading: true });
      const url = `https://api.chess.com/pub/titled/${titled}`;
      const { data: { players = [] } = { players: [] } } = await axios.get<{
        players: string[];
      }>(url);
      setList({ loading: false, players });
    };
    getPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titled]);

  const filteredPlayers = list.players.filter((player) => {
    if (username === '') {
      return true;
    }
    return player.includes(username);
  });

  return (
    <>
      <Navbar></Navbar>
      <main className="container mx-auto p-8">
        <div className="border rounded shadow p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <TextField
                id="username"
                placeholder="username"
                value={username}
                label="Username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="title-select-label">Titled</InputLabel>
              <Select
                labelId="title-select-label"
                id="title-select"
                value={titled}
                label="Titled"
                onChange={(event) => {
                  const newTitled: Titled = event.target.value as Titled;
                  router.push(pathname, {
                    query: { ...query, titled: newTitled },
                  });
                  setTitled(newTitled);
                }}
              >
                <MenuItem value={Titled.GRAND_MASTER}>
                  Grand Master (GM)
                </MenuItem>
                <MenuItem value={Titled.INTERNATIONAL_MASTER}>
                  International Master (IM)
                </MenuItem>
                <MenuItem value={Titled.FIDE_MASTER}>FIDE Master (FM)</MenuItem>
                <MenuItem value={Titled.CANDIDATE_MASTER}>
                  Candidate Master (CM)
                </MenuItem>
                <MenuItem value={Titled.WOMAN_GRAND_MASTER}>
                  Woman Grand Master (WGM)
                </MenuItem>
                <MenuItem value={Titled.WOMAN_INTERNATIONAL_MASTER}>
                  Woman International Master (WIM)
                </MenuItem>
                <MenuItem value={Titled.WOMAN_FIDE_MASTER}>
                  Woman FIDE Master (WFM)
                </MenuItem>
                <MenuItem value={Titled.WOMAN_CANDIDATE_MASTER}>
                  Woman Candidate Master (WCM)
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          {list.loading && (
            <div className="text-center py-8 border-b">LOADING</div>
          )}
          {!list.loading &&
            filteredPlayers.map((player) => (
              <div key={player} className="py-4 border-b">
                <Link href={`/chess.com/${player}`} className="underline">
                  {player}
                </Link>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ChessComPageProps>> => {
  console.log(context);
  console.log(context.query.titled);
  const titled = (context.query.titled as Titled) || Titled.GRAND_MASTER;
  console.log(titled);
  const url = `https://api.chess.com/pub/titled/${titled}`;
  const { data: { players = [] } = { players: [] } } = await axios.get<{
    players: string[];
  }>(url);
  return { props: { defaultTitled: titled, defaultPlayers: players } };
};

export default ChessComPage;
