import * as mongoose from 'mongoose';
import IOrder from '../interfaces/IOrder';

const baseOptions = {
  timestamps: true,
};

const orderSchema = new mongoose.Schema(
  {
    shipmentType: {
      type: String,
      required: true,
    },
    shipperName: {
      type: String,
      required: true,
    },
    recieverDetails: {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
    },
    allowOpen: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    userId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      statusId: {
        ref: 'OrderStatus',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      feedback: {
        type: String,
      },
    },
    assignedCourier: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    assignedCourierVoltId: {
      type: String
    },
    price: {
      type: Number,
      required: true,
    },
    voltId: {
      type: String,
      required: true,
    },
    cashDelivered: {
      type: Boolean,
      required:true,
      default: false
    },
    assignable:{
      type: Boolean,
      required: true,
      default: true
    },
    userVoltId:{
      type: String
    }
  },
  baseOptions
);

const orderModel = mongoose.model<IOrder>('Order', orderSchema);

export default orderModel;
