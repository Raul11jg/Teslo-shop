import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';
import { db } from '../../../database';

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  let condition = {};

  if (slug) {
    condition = { slug };
  }

  await db.connect();
  const product = await Product.findOne(condition).lean();

  await db.disconnect();

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  product.images = product.images.map((image) => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
  });

  return res.json(product);
};
