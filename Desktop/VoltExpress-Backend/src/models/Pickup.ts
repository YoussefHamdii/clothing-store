import * as mongoose from 'mongoose';
import IPickup from '../interfaces/IPickup';

const baseOptions = {
  timestamps: true,
};

const pickupSchema = new mongoose.Schema(
  {
    pickupDetails: {
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
    pickupDate: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    pickupNotes: {
      type: String,
    },
    userId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    assignedCourier: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    isPickedup: {
      default: false,
      type: Boolean,
      required: true,
    },
    voltId: {
      type: String,
      required: true
  }
  },
  baseOptions
);

const pickupModel = mongoose.model<IPickup>('Pickup', pickupSchema);

export default pickupModel;
