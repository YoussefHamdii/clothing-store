import { Document } from 'mongoose';
interface IOrderStatus extends Document {
  status: string;
  feedback: string;
}

export default IOrderStatus;
