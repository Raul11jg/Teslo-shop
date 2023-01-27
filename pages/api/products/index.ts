import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';
import { db } from '../../../database';

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      res.status(200).json({ message: 'POST request' });
      break;
    default:
      res.status(405).end();
      break;
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().select('title price images inStock slug -_id').lean();

  await db.disconnect();

  res.status(200).json(products);
};
