import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';
import { validations } from '../../../utils';

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
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'Name must be at least 3 characters long' });
  }
  //TODO: Validate email
  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'Email must be valid' });
  }

  await db.connect();
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  await db.disconnect();

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
