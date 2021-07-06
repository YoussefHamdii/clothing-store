import { Document } from 'mongoose';
import IRecieverDetails from './IRecieverDetails';

interface IPickup extends Document {
  pickupDetails: IRecieverDetails;
  pickupDate: string;
  pickupTime: string;
  pickupNotes: string;
  userId: string;
  assignedCourier: string;
  isPickedup: boolean;
  voltId: string;
}

export default IPickup;
