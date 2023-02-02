import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        name: string;
        role: string;
        email: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return checkJWT(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;

  let userId = '';

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await db.connect();

  const user = await User.findById(userId).lean();

  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: 'User doesnt exists' });
  }

  const { role, name, _id, email } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, user.email),
    user: {
      email,
      role,
      name,
    },
  });

  /*   if (!user) {
    return res.status(400).json({ message: 'Invalid credentials or email' });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: 'Invalid credentials or email' });
  }

  const { role, name, _id } = user;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  }); */
};
