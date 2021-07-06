import { Request } from 'express';
import IUser from './IUser';

interface IUserRequest extends Request {
  user: IUser;
}

export default IUserRequest;
