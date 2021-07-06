import { Document } from 'mongoose';

interface IVoltId extends Document{
    type: string;
    max: number;
}

export default IVoltId;