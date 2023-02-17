import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'POST':
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find().sort({ title: 'asc' }).lean();

  await db.disconnect();

  //TODO: Actualizar imagenes

  res.status(200).json(products);
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) return res.status(400).json({ message: 'Invalid product' });

  if (images.length < 2) return res.status(400).json({ message: '2 images at least' });

  //TODO: procesar imagenes

  try {
    await db.connect();

    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'Product not found' });
    }

    //TODO: Eliminar fotos en Cloudinary

    await product.update(req.body);
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: 'Error, check console' });
  }
};
