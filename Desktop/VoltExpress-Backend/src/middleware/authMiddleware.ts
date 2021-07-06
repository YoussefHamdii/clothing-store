import { Response, NextFunction } from 'express';
import IDataStoredInToken from 'interfaces/IDataStoredInToken';
import * as jwt from 'jsonwebtoken';

import IUserRequest from '../interfaces/IUserRequest';
import IUser from '../interfaces/IUser';
import userModel from '../models/User';
import HttpException from '../exceptions/httpException';

async function authMiddleware(
  request: IUserRequest,
  response: Response,
  next: NextFunction
) {
  const headers = request.headers;
  if (headers['authorization']) {
    const secret = process.env.JWT_SECRET;
    try {
      const verification = jwt.verify(
        headers['authorization'].split(' ')[1],
        secret
      ) as IDataStoredInToken;
      const _id = verification._id;
      await userModel.findById(_id, (error, user: IUser) => {
        if (error) {
          next(new HttpException(500, 'Wrong Authentication Token!'));
        } else if (user) {
          request.user = user;
          next();
        } else {
          next(new HttpException(404, 'User not authenticated!'));
        }
      });
    } catch {
      next(new HttpException(500, 'Wrong Authentication Token!'));
    }
  } else {
    next(new HttpException(500, 'Authentication token missing!'));
  }
}

export default authMiddleware;
