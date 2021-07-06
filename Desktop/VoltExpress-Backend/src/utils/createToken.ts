import * as jwt from 'jsonwebtoken';

import IUser from '../interfaces/IUser';
import IDataStoredInToken from '../interfaces/IDataStoredInToken';

function createToken(user: IUser, expiresIn: number) {
  const secret = process.env.JWT_SECRET;
  const dataStored: IDataStoredInToken = {
    _id: user._id,
  };
  return jwt.sign(dataStored, secret, { expiresIn });
}

export default createToken;
