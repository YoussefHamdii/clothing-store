import { Document } from 'mongoose';
import IRecieverDetails from './IRecieverDetails';
import IStatus from './IStatus';

interface IOrder extends Document {
  shipmentType: string;
  shipperName: string;
  recieverDetails: IRecieverDetails;
  allowOpen: boolean;
  description: string;
  userId: string;
  status: IStatus;
  deliever: Date;
  assignedCourier: string;
  price: number;
  voltId: string;
  assignedCourierVoltId: string;
  assignable: boolean;
}

export default IOrder;
