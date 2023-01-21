import { Player, PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Element, load } from 'cheerio';
import { Ranking, TimeClass } from '../../src/types';

const prismaClient = new PrismaClient();

const getRankings = (html: string): Ranking[] => {
  const $ = load(html);
  const rankings: Ranking[] = [];
  $('table tr').each((_index: number, element: Element) => {
    const ranking: Ranking = {
      id: '0',
      name: '',
      country: '',
      rating: '0',
    };
    $(element)
      .children('td')
      .each((index: number, cell: Element) => {
        if (index === 0) ranking.id = $(cell).text().trim();
        if (index === 1) {
          ranking.id =
            $(cell).find('a').attr('href')?.trim().replace('/profile/', '') ||
            '0';
          ranking.name = $(cell).text().trim() || '';
        }
        if (index === 2) ranking.country = $(cell).text().trim() || '';
        if (index === 3) ranking.rating = $(cell).text().trim() || '0';
      });
    rankings.push(ranking);
  });
  return rankings;
};

const list: Record<TimeClass, string> = {
  classical: 'men',
  rapid: 'men_rapid',
  blitz: 'men_blitz',
};

const main = async () => {
  const timeClasses = ['classical', 'rapid', 'blitz'];
  const players: Player[] = [];
  const baseUrl = 'https://ratings.fide.com';
  for (const timeClass of timeClasses) {
    const url: string = `${baseUrl}/a_top.phtml?list=${
      list[timeClass as TimeClass]
    }`;
    const { data } = await axios.get<string>(url);
    const rankings = await getRankings(data);
    for (const ranking of rankings) {
      const playerIndex = players.findIndex(
        (player) => player.id === ranking.id
      );
      if (playerIndex !== -1) {
        const player = players[playerIndex];
        players[playerIndex] = {
          ...player,
          [timeClass]: parseInt(ranking.rating, 10),
        };
      } else {
        players.push({
          id: ranking.id,
          name: ranking.name,
          country: ranking.country,
          classical:
            timeClass === 'classical' ? parseInt(ranking.rating, 10) : 0,
          rapid: timeClass === 'rapid' ? parseInt(ranking.rating, 10) : 0,
          blitz: timeClass === 'blitz' ? parseInt(ranking.rating, 10) : 0,
          average: 0,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        });
      }
    }
  }

  await prismaClient.player.deleteMany();
  for (const player of players) {
    if (player.id === '0') {
      continue;
    }
    player.average = Math.round(
      (player.classical * 3 + player.rapid * 2 + player.blitz) / 6
    );
    await prismaClient.player.upsert({
      create: player,
      update: player,
      where: { id: player.id },
    });
  }
};

main().catch((error) => console.error(error));
