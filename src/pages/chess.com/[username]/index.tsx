import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { toPng, toSvg, toJpeg } from 'html-to-image';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Navbar from '../../../components/Navbar';

const options: Record<string, string> = {
  jpg: 'JPG',
  png: 'PNG',
  svg: 'SVG',
};

type Theme =
  | 'algolia'
  | 'apprentice'
  | 'aura'
  | 'aura-dark'
  | 'ayu-mirage'
  | 'bear'
  | 'blueberry'
  | 'blue-green'
  | 'buefy'
  | 'calm'
  | 'chartreuse-dark'
  | 'city-lights'
  | 'cobalt'
  | 'cobalt2'
  | 'codeSTACKr'
  | 'darcula'
  | 'dark'
  | 'date-night'
  | 'default'
  | 'default-repocard'
  | 'discord-old-blurple'
  | 'dracula'
  | 'flag-india'
  | 'github-dark'
  | 'gotham'
  | 'graywhite'
  | 'great-gatsby'
  | 'gruvbox'
  | 'gruvbox-light'
  | 'highcontrast'
  | 'jolly'
  | 'kacho-ga'
  | 'maroongold'
  | 'material-palenight'
  | 'merko'
  | 'midnight-purple'
  | 'moltack'
  | 'monokai'
  | 'nightowl'
  | 'noctis-minimus'
  | 'nord'
  | 'ocean-dark'
  | 'omni'
  | 'onedark'
  | 'outrun'
  | 'panda'
  | 'prussian'
  | 'radical'
  | 'react'
  | 'rose-pine'
  | 'shades-of-purple'
  | 'slateorange'
  | 'solarized-dark'
  | 'solarized-light'
  | 'swift'
  | 'synthwave'
  | 'tokyonight'
  | 'transparent'
  | 'vision-friendly-dark'
  | 'vue'
  | 'vue-dark'
  | 'yeblu';

type Colors = {
  backgroundColor: string;
  titleColor: string;
  textColor: string;
  iconColor: string;
  borderColor?: string;
};

const themes: Record<Theme, Colors> = {
  default: {
    titleColor: '2f80ed',
    iconColor: '4c71f2',
    textColor: '434d58',
    backgroundColor: 'fffefe',
    borderColor: 'e4e2e2',
  },
  'default-repocard': {
    titleColor: '2f80ed',
    iconColor: '586069', // icon color is different
    textColor: '434d58',
    backgroundColor: 'fffefe',
  },
  transparent: {
    titleColor: '006AFF',
    iconColor: '0579C3',
    textColor: '417E87',
    backgroundColor: 'ffffff00',
  },
  dark: {
    titleColor: 'fff',
    iconColor: '79ff97',
    textColor: '9f9f9f',
    backgroundColor: '151515',
  },
  radical: {
    titleColor: 'fe428e',
    iconColor: 'f8d847',
    textColor: 'a9fef7',
    backgroundColor: '141321',
  },
  merko: {
    titleColor: 'abd200',
    iconColor: 'b7d364',
    textColor: '68b587',
    backgroundColor: '0a0f0b',
  },
  gruvbox: {
    titleColor: 'fabd2f',
    iconColor: 'fe8019',
    textColor: '8ec07c',
    backgroundColor: '282828',
  },
  'gruvbox-light': {
    titleColor: 'b57614',
    iconColor: 'af3a03',
    textColor: '427b58',
    backgroundColor: 'fbf1c7',
  },
  tokyonight: {
    titleColor: '70a5fd',
    iconColor: 'bf91f3',
    textColor: '38bdae',
    backgroundColor: '1a1b27',
  },
  onedark: {
    titleColor: 'e4bf7a',
    iconColor: '8eb573',
    textColor: 'df6d74',
    backgroundColor: '282c34',
  },
  cobalt: {
    titleColor: 'e683d9',
    iconColor: '0480ef',
    textColor: '75eeb2',
    backgroundColor: '193549',
  },
  synthwave: {
    titleColor: 'e2e9ec',
    iconColor: 'ef8539',
    textColor: 'e5289e',
    backgroundColor: '2b213a',
  },
  highcontrast: {
    titleColor: 'e7f216',
    iconColor: '00ffff',
    textColor: 'fff',
    backgroundColor: '000',
  },
  dracula: {
    titleColor: 'ff6e96',
    iconColor: '79dafa',
    textColor: 'f8f8f2',
    backgroundColor: '282a36',
  },
  prussian: {
    titleColor: 'bddfff',
    iconColor: '38a0ff',
    textColor: '6e93b5',
    backgroundColor: '172f45',
  },
  monokai: {
    titleColor: 'eb1f6a',
    iconColor: 'e28905',
    textColor: 'f1f1eb',
    backgroundColor: '272822',
  },
  vue: {
    titleColor: '41b883',
    iconColor: '41b883',
    textColor: '273849',
    backgroundColor: 'fffefe',
  },
  'vue-dark': {
    titleColor: '41b883',
    iconColor: '41b883',
    textColor: 'fffefe',
    backgroundColor: '273849',
  },
  'shades-of-purple': {
    titleColor: 'fad000',
    iconColor: 'b362ff',
    textColor: 'a599e9',
    backgroundColor: '2d2b55',
  },
  nightowl: {
    titleColor: 'c792ea',
    iconColor: 'ffeb95',
    textColor: '7fdbca',
    backgroundColor: '011627',
  },
  buefy: {
    titleColor: '7957d5',
    iconColor: 'ff3860',
    textColor: '363636',
    backgroundColor: 'ffffff',
  },
  'blue-green': {
    titleColor: '2f97c1',
    iconColor: 'f5b700',
    textColor: '0cf574',
    backgroundColor: '040f0f',
  },
  algolia: {
    titleColor: '00AEFF',
    iconColor: '2DDE98',
    textColor: 'FFFFFF',
    backgroundColor: '050F2C',
  },
  'great-gatsby': {
    titleColor: 'ffa726',
    iconColor: 'ffb74d',
    textColor: 'ffd95b',
    backgroundColor: '000000',
  },
  darcula: {
    titleColor: 'BA5F17',
    iconColor: '84628F',
    textColor: 'BEBEBE',
    backgroundColor: '242424',
  },
  bear: {
    titleColor: 'e03c8a',
    iconColor: '00AEFF',
    textColor: 'bcb28d',
    backgroundColor: '1f2023',
  },
  'solarized-dark': {
    titleColor: '268bd2',
    iconColor: 'b58900',
    textColor: '859900',
    backgroundColor: '002b36',
  },
  'solarized-light': {
    titleColor: '268bd2',
    iconColor: 'b58900',
    textColor: '859900',
    backgroundColor: 'fdf6e3',
  },
  'chartreuse-dark': {
    titleColor: '7fff00',
    iconColor: '00AEFF',
    textColor: 'fff',
    backgroundColor: '000',
  },
  nord: {
    titleColor: '81a1c1',
    textColor: 'd8dee9',
    iconColor: '88c0d0',
    backgroundColor: '2e3440',
  },
  gotham: {
    titleColor: '2aa889',
    iconColor: '599cab',
    textColor: '99d1ce',
    backgroundColor: '0c1014',
  },
  'material-palenight': {
    titleColor: 'c792ea',
    iconColor: '89ddff',
    textColor: 'a6accd',
    backgroundColor: '292d3e',
  },
  graywhite: {
    titleColor: '24292e',
    iconColor: '24292e',
    textColor: '24292e',
    backgroundColor: 'ffffff',
  },
  'vision-friendly-dark': {
    titleColor: 'ffb000',
    iconColor: '785ef0',
    textColor: 'ffffff',
    backgroundColor: '000000',
  },
  'ayu-mirage': {
    titleColor: 'f4cd7c',
    iconColor: '73d0ff',
    textColor: 'c7c8c2',
    backgroundColor: '1f2430',
  },
  'midnight-purple': {
    titleColor: '9745f5',
    iconColor: '9f4bff',
    textColor: 'ffffff',
    backgroundColor: '000000',
  },
  calm: {
    titleColor: 'e07a5f',
    iconColor: 'edae49',
    textColor: 'ebcfb2',
    backgroundColor: '373f51',
  },
  'flag-india': {
    titleColor: 'ff8f1c',
    iconColor: '250E62',
    textColor: '509E2F',
    backgroundColor: 'ffffff',
  },
  omni: {
    titleColor: 'FF79C6',
    iconColor: 'e7de79',
    textColor: 'E1E1E6',
    backgroundColor: '191622',
  },
  react: {
    titleColor: '61dafb',
    iconColor: '61dafb',
    textColor: 'ffffff',
    backgroundColor: '20232a',
  },
  jolly: {
    titleColor: 'ff64da',
    iconColor: 'a960ff',
    textColor: 'ffffff',
    backgroundColor: '291B3E',
  },
  maroongold: {
    titleColor: 'F7EF8A',
    iconColor: 'F7EF8A',
    textColor: 'E0AA3E',
    backgroundColor: '260000',
  },
  yeblu: {
    titleColor: 'ffff00',
    iconColor: 'ffff00',
    textColor: 'ffffff',
    backgroundColor: '002046',
  },
  blueberry: {
    titleColor: '82aaff',
    iconColor: '89ddff',
    textColor: '27e8a7',
    backgroundColor: '242938',
  },
  slateorange: {
    titleColor: 'faa627',
    iconColor: 'faa627',
    textColor: 'ffffff',
    backgroundColor: '36393f',
  },
  'kacho-ga': {
    titleColor: 'bf4a3f',
    iconColor: 'a64833',
    textColor: 'd9c8a9',
    backgroundColor: '402b23',
  },
  outrun: {
    titleColor: 'ffcc00',
    iconColor: 'ff1aff',
    textColor: '8080ff',
    backgroundColor: '141439',
  },
  'ocean-dark': {
    titleColor: '8957B2',
    iconColor: 'FFFFFF',
    textColor: '92D534',
    backgroundColor: '151A28',
  },
  'city-lights': {
    titleColor: '5D8CB3',
    iconColor: '4798FF',
    textColor: '718CA1',
    backgroundColor: '1D252C',
  },
  'github-dark': {
    titleColor: '58A6FF',
    iconColor: '1F6FEB',
    textColor: 'C3D1D9',
    backgroundColor: '0D1117',
  },
  'discord-old-blurple': {
    titleColor: '7289DA',
    iconColor: '7289DA',
    textColor: 'FFFFFF',
    backgroundColor: '2C2F33',
  },
  'aura-dark': {
    titleColor: 'ff7372',
    iconColor: '6cffd0',
    textColor: 'dbdbdb',
    backgroundColor: '252334',
  },
  panda: {
    titleColor: '19f9d899',
    iconColor: '19f9d899',
    textColor: 'FF75B5',
    backgroundColor: '31353a',
  },
  'noctis-minimus': {
    titleColor: 'd3b692',
    iconColor: '72b7c0',
    textColor: 'c5cdd3',
    backgroundColor: '1b2932',
  },
  cobalt2: {
    titleColor: 'ffc600',
    iconColor: 'ffffff',
    textColor: '0088ff',
    backgroundColor: '193549',
  },
  swift: {
    titleColor: '000000',
    iconColor: 'f05237',
    textColor: '000000',
    backgroundColor: 'f7f7f7',
  },
  aura: {
    titleColor: 'a277ff',
    iconColor: 'ffca85',
    textColor: '61ffca',
    backgroundColor: '15141b',
  },
  apprentice: {
    titleColor: 'ffffff',
    iconColor: 'ffffaf',
    textColor: 'bcbcbc',
    backgroundColor: '262626',
  },
  moltack: {
    titleColor: '86092C',
    iconColor: '86092C',
    textColor: '574038',
    backgroundColor: 'F5E1C0',
  },
  codeSTACKr: {
    titleColor: 'ff652f',
    iconColor: 'FFE400',
    textColor: 'ffffff',
    backgroundColor: '09131B',
    borderColor: '0c1a25',
  },
  'rose-pine': {
    titleColor: '9ccfd8',
    iconColor: 'ebbcba',
    textColor: 'e0def4',
    backgroundColor: '191724',
  },
  'date-night': {
    titleColor: 'DA7885',
    textColor: 'E1B2A2',
    iconColor: 'BB8470',
    borderColor: '170F0C',
    backgroundColor: '170F0C',
  },
};

type ProfileType = {
  avatar: string;
  player_id: number;
  '@id': string;
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

type StatsLast = {
  rating: number;
  date: number;
  rd: number;
};

type StatsBest = {
  rating: number;
  date: number;
  game: string;
};

type StatsRecord = {
  win: number;
  loss: number;
  draw: number;
};

type StatsRecordDaily = StatsRecord & {
  time_per_move: number;
  timeout_percent: number;
};

type StatsDaily = {
  last: StatsLast;
  best: StatsBest;
  record: StatsRecordDaily;
};

type StatsVariant = {
  last: StatsLast;
  best: StatsBest;
  record: StatsRecord;
};

type StatsType = {
  chess_daily: StatsDaily;
  chess960_daily: StatsDaily;
  chess_rapid: StatsVariant;
  chess_bullet: StatsVariant;
  chess_blitz: StatsVariant;
  fide: number;
  tactics: {
    highest: {
      rating: number;
      date: number;
    };
    lowest: {
      rating: number;
      date: number;
    };
  };
  puzzle_rush: {
    best: {
      total_attempts: number;
      score: number;
    };
    daily: {
      total_attempts: number;
      score: number;
    };
  };
};

const Profile: React.FC<{ profile: ProfileType; theme: Theme }> = ({
  profile,
  theme,
}) => {
  const titleColor = themes[theme].titleColor;
  const borderColor = themes[theme].borderColor || 'ffffff';

  return (
    <>
      <div className="mb-8">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={160}
          height={160}
          className="mx-auto rounded-full border"
          style={{ borderColor: `#${borderColor}` }}
        />
      </div>
      <div
        className="pb-6 border-b"
        style={{ borderBottomColor: `#${titleColor}` }}
      >
        <Typography
          className={`text-center text-xl uppercase`}
          style={{ color: `#${titleColor}` }}
        >
          {profile.name}
        </Typography>
        <Link href={profile.url} target="_blank">
          <Typography
            className={`text-center text-gray-500`}
            style={{ color: `#${titleColor}`, opacity: '0.75' }}
          >
            @{profile.username}
          </Typography>
        </Link>
      </div>
    </>
  );
};

const Stats: React.FC<{ stats: StatsType; theme: Theme }> = ({
  stats,
  theme,
}) => {
  const ratings = [
    { timeClass: 'bullet', rating: stats.chess_bullet?.last.rating || 'N/A' },
    { timeClass: 'blitz', rating: stats.chess_blitz?.last.rating || 'N/A' },
    { timeClass: 'rapid', rating: stats.chess_rapid?.last.rating || 'N/A' },
    { timeClass: 'daily', rating: stats.chess_daily?.last.rating || 'N/A' },
  ];

  const textColor = themes[theme].textColor;

  return (
    <>
      <div
        className="border-b py-6"
        style={{ borderBottomColor: `#${textColor}` }}
      >
        <div className="grid grid-cols-2 gap-4">
          {ratings.map((rating) => {
            return (
              <div
                key={rating.timeClass}
                className="col-span-1 flex justify-between items-center"
              >
                <Typography
                  className="text-gray-500 uppercase"
                  style={{ color: `#${textColor}`, opacity: '0.75' }}
                >
                  {rating.timeClass}
                </Typography>
                <Typography
                  className="text-lg"
                  style={{ color: `#${textColor}` }}
                >
                  {rating.rating}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Card: React.FC<{
  profile: ProfileType;
  stats: StatsType;
  theme: Theme;
}> = ({ profile, stats, theme }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [format, setFormat] = React.useState('svg');

  const handleClick = async () => {
    console.info(`You clicked ${options[format]}`);
    let fileContent: string = '';
    const id = `card-${theme}`;
    const element = document.getElementById(id)!;
    if (format === 'svg') {
      fileContent = await toSvg(element);
    } else if (format === 'png') {
      fileContent = await toPng(element);
    } else if (format === 'jpg') {
      fileContent = await toJpeg(element);
    }
    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('href', fileContent);
    const fileName = `${profile.username}-${theme}.${format}`;
    anchorElement.setAttribute('download', fileName);
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    key: string
  ) => {
    setFormat(key);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const backgroundColor: string = themes[theme].backgroundColor;

  return (
    <div className="border rounded p-8">
      <div
        id={`card-${theme}`}
        className="max-w-xs mx-auto border rounded-3xl px-6 py-12 shadow-2xl"
        style={{ backgroundColor: `#${backgroundColor}` }}
      >
        <Profile profile={profile} theme={theme} />
        <Stats stats={stats} theme={theme} />
      </div>
      <div className="mt-8">
        <ButtonGroup
          variant="outlined"
          ref={anchorRef}
          aria-label="split button"
          className="w-full"
        >
          <Button onClick={handleClick} className="w-full">
            {theme}.{options[format]}
          </Button>
          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select format"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {Object.keys(options).map((key: string) => (
                      <MenuItem
                        key={key}
                        selected={key === format}
                        onClick={(event) => handleMenuItemClick(event, key)}
                        className="uppercase"
                      >
                        {options[key]}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

type ChessComProfilePageProps = {
  profile: ProfileType;
  stats: StatsType;
};

const ChessComProfilePage: NextPage<ChessComProfilePageProps> = ({
  profile,
  stats,
}) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-3 gap-8">
          {Object.keys(themes)
            .sort()
            .map((theme) => {
              return (
                <Card
                  key={theme}
                  profile={profile}
                  stats={stats}
                  theme={theme as Theme}
                />
              );
            })}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ChessComProfilePageProps>> => {
  const username: string = context.query.username as string;
  const profileUrl = `https://api.chess.com/pub/player/${username}`;
  const { data: profile } = await axios.get<ProfileType>(profileUrl);
  const statsUrl = `${profileUrl}/stats`;
  const { data: stats } = await axios.get<StatsType>(statsUrl);
  return { props: { profile, stats } };
};

export default ChessComProfilePage;
