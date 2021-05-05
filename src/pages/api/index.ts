import type { NextApiRequest, NextApiResponse } from 'next';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const { VERCEL_URL } = process.env;
  const projectName = VERCEL_URL?.match(/(.+)-[^-]+-.+/);
  res.status(200).json({ projectName });
};
