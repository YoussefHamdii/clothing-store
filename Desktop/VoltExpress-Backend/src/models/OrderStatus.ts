import * as mongoose from 'mongoose';
import IOrderStatus from './../interfaces/IOrderStatus';
const orderStatusSchema = new mongoose.Schema({
  status: { type: String, required: true },
  feedback: String,
});

const orderStatusModel = mongoose.model<IOrderStatus>(
  'OrderStatus',
  orderStatusSchema
);
export default orderStatusModel;
