import type { NextApiRequest, NextApiResponse } from 'next';

const { VERCEL_URL } = process.env;
const projectName = VERCEL_URL?.match(/(.+)-[^-]+-.+/)[1] || process.env.PROJECT;

export interface VercelEnv {
  type: string;
  id: string;
  key: string;
  value: string;
  target: string[];
  configurationId: null;
  gitBranch: null;
  updatedAt: number;
  createdAt: number;
}

const getEnv = (projectName: string, envName: string): Promise<VercelEnv | undefined> => {
  return new Promise((resolve, reject) =>
    fetch(`https://api.vercel.com/v7/projects/${projectName}/env`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    })
      .then((r) => r.json())
      .then(({ envs }) => {
        const env = envs.find(({ key }) => key === envName);
        resolve(env);
      })
      .catch(reject)
  );
};
const setEnv = (projectName: string, envId: string, value: string): Promise<VercelEnv> => {
  return new Promise((resolve, reject) =>
    fetch(`https://api.vercel.com/v7/projects/${projectName}/env/${envId}`, {
      method: 'patch',
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    })
      .then((r) => r.json())
      .then((env) => {
        resolve(env);
      })
      .catch(reject)
  );
};
export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const env = await getEnv(projectName, 'COUNT');
  if (env) {
    setEnv(projectName, env.id, String(Number(env.value) + 1)).then((value) =>
      res.status(200).json(value.value)
    );
  }
};
