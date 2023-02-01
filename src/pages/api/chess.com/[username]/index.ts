import { NextApiRequest, NextApiResponse } from 'next';

type Data = {};

const handler = (request: NextApiRequest, response: NextApiResponse<Data>) => {
  if (request.method === 'GET') {
  } else {
    response.status(405);
  }
};

export default handler;
