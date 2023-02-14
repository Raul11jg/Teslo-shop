import type { NextApiRequest, NextApiResponse } from 'next';
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Product, Order } from '../../../models';

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ message: 'GET' });
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;
  console.log({ req });

  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((product) => product.id === current._id)?.price;

      if (!currentPrice) {
        throw new Error('Product not found, check product');
      }

      return prev + currentPrice * current.quantity;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal + subTotal * taxRate;

    if (backendTotal !== total) {
      console.log(backendTotal, total);

      throw new Error('Total is not correct');
    }

    const userId = session.user._id;
    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: userId,
    });
    console.log({ newOrder });

    await newOrder.save();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);

    return res.status(400).json({ message: error.message || 'Something went wrong' });
  }
};
