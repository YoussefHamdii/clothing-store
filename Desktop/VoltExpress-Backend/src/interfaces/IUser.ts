import { Document } from 'mongoose';
import IPhone from './IPhone';

interface IUser extends Document{
    email: string;
    password: string;
    name: string;
    phoneNumber: IPhone;
    role: string;
    voltId: string;
}

export default IUser;