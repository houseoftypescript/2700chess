import axios from 'axios';
import { load, Element } from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Ranking, TimeControl } from '../../../types';

type Data = {
  rankings?: Ranking[];
  message?: string;
};

const getRankings = (html: string): Ranking[] => {
  const $ = load(html);
  const rankings: Ranking[] = [];
  $('table tr').each((index: number, element: Element) => {
    const ranking: Ranking = {
      rank: '0',
      name: '',
      country: '',
      rating: '0',
    };
    $(element)
      .children('td')
      .each((index: number, cell: Element) => {
        if (index === 0) ranking.rank = $(cell).text().trim();
        if (index === 1) ranking.name = $(cell).text().trim();
        if (index === 2) ranking.country = $(cell).text().trim();
        if (index === 3) ranking.rating = $(cell).text().trim();
      });
    rankings.push(ranking);
  });
  return rankings;
};

const list: Record<TimeControl, string> = {
  classical: 'men',
  rapid: 'men_rapid',
  blitz: 'men_blitz',
};

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<Data>
) => {
  if (request.method === 'GET') {
    try {
      const url: string = `https://ratings.fide.com/a_top.phtml?list=${
        list[request.query.timecontrol as TimeControl]
      }`;
      const { data } = await axios.get<string>(url);
      const rankings = getRankings(data).filter(
        (ranking) => parseFloat(ranking.rating) >= 2700
      );
      response.status(200).json({ rankings, message: 'success' });
    } catch (error) {
      console.error(error);
      response.status(500).json({ rankings: [], message: 'error' });
    }
  } else {
    response.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
