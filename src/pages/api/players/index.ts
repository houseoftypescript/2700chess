import { Player } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../libs/prisma';

type Data = {
  players?: Player[];
  message?: string;
};

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<Data>
) => {
  if (request.method === 'GET') {
    try {
      const players = await prismaClient.player.findMany({
        where: {
          OR: [
            { classical: { gte: 2700 } },
            { rapid: { gte: 2700 } },
            { blitz: { gte: 2700 } },
          ],
        },
      });
      response.status(200).json({ players, message: 'success' });
    } catch (error) {
      console.error(error);
      response.status(500).json({ players: [], message: 'error' });
    }
  } else {
    response.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
