import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number;
      notPaidOrders: number;
      numberOfClients: number; //role client
      numberOfProducts: number;
      productsWithNoInventory: number;
      lowInventory: number; // productos con 10 o menos unidades
    }
  | { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getInfoDashboard(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getInfoDashboard = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const session: any = await getSession({ req });

  /*   if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  } */
  await db.connect();

  const orders = await Order.find().select('isPaid -_id').lean();
  const numberOfOrders = orders.length;
  const paidOrders = orders.filter((order) => order.isPaid).length;
  const notPaidOrders = orders.filter((order) => !order.isPaid).length;

  const numberOfClients = await User.countDocuments({ role: 'client' });

  const products = await Product.find().select('inStock -_id').lean();
  const numberOfProducts = products.length;
  const productsWithNoInventory = products.filter((product) => product.inStock === 0).length;
  const lowInventory = products.filter((product) => product.inStock <= 10).length;

  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
};
